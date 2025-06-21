import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ReservationsPage = ({ navigation, route }) => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);
    
    // États pour les informations de paiement
    const [mobilePhone, setMobilePhone] = useState('');
    const [mobilePhoneName, setMobilePhoneName] = useState('');

    // États pour les informations d'annulation
    const [causeAnnulation, setCauseAnnulation] = useState('');
    const [origineAnnulation, setOrigineAnnulation] = useState('CLIENT');

    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0
    });

    // Récupérer les données utilisateur depuis les paramètres de route
    const { userData, token, nom_envoye } = route.params || {};

    // Fonctions de navigation pour la barre de navigation
    const navigateToHome = () => {
        navigation.navigate('App8', {
            nom_envoye: nom_envoye,
            userData: userData,
            token: token
        });
    };

    const navigateToNotifications = () => {
        // À implémenter selon votre logique
        Alert.alert('Info', 'Page Notifications en cours de développement');
    };

    // Fonction pour formater la date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Fonction pour obtenir les initiales du nom de l'agence
    const getInitials = (nomAgence) => {
        return nomAgence
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'Heure non définie';
        return timeString.slice(timeString.indexOf('T') + 1, timeString.indexOf('M'));
    };

    const tickets = () => {
        navigation.navigate('App15', {
        token: token,
        userData: userData,
        nom_envoye: nom_envoye
        });
    };

    // Fonction pour récupérer les réservations depuis l'API
    const fetchReservations = async (page = 0, size = 10) => {
        try {
            setLoading(true);
            
            // Utiliser l'ID utilisateur depuis userData
            const userId = userData?.id || userData?.userId || '3fa85f64-5717-4562-b3fc-2c963f66afa6';
            
            const response = await fetch(`http://agence-voyage.ddns.net/api/reservation/utilisateur/${userId}?page=${page}&size=${size}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            });

            if (response.status == 200) {
                const data = await response.json();
                if (!(Array.isArray(data.content))) {
                    setReservations([]);
                    setPagination({
                        currentPage: page,
                        totalPages: Math.ceil(data.length / size),
                        totalElements: data.length
                    });
                } else {
                    const res = data.content.filter(item => 
                        item.reservation.statutPayement !== 'PAID'
                    );
                    setReservations(res);
                    setPagination({
                        currentPage: page,
                        totalPages: Math.ceil(data.length / size),
                        totalElements: data.length
                    });
                }
            } else if(response.status == 400) {
                setReservations([]);
                setPagination({
                    currentPage: page,
                    totalPages: Math.ceil(data.length / size),
                    totalElements: data.length
                });
            } else {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

        } catch (error) {
            setReservations([]);
            console.error('Erreur lors de la récupération des réservations:', error);
            Alert.alert(
                'Erreur', 
                'Impossible de charger vos réservations. Vérifiez votre connexion internet.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour ouvrir le modal de paiement
    const ouvrirModalPaiement = (reservation) => {
        setSelectedReservation(reservation);
        setMobilePhone('');
        setMobilePhoneName('');
        setShowPaymentModal(true);
    };

    // Fonction pour fermer le modal de paiement
    const fermerModalPaiement = () => {
        setShowPaymentModal(false);
        setSelectedReservation(null);
        setMobilePhone('');
        setMobilePhoneName('');
    };

    const annulerReservation = (reservation) => {
        ouvrirModalAnnulation(reservation);
    };

    // Fonction pour effectuer le paiement
    const effectuerPaiement = async () => {
        if (!mobilePhone.trim()) {
            Alert.alert('Erreur', 'Veuillez saisir votre numéro de téléphone');
            return;
        }
        
        if (!mobilePhoneName.trim()) {
            Alert.alert('Erreur', 'Veuillez saisir le nom du propriétaire du téléphone');
            return;
        }

        try {
            setPaymentLoading(true);
            
            const paymentData = {
                mobilePhone: mobilePhone.trim(),
                mobilePhoneName: mobilePhoneName.trim(),
                amount: selectedReservation.reservation.prixTotal,
                userId: userData?.userId,
                reservationId: selectedReservation.reservation.idReservation
            };

            const response = await fetch('http://agence-voyage.ddns.net/api/reservation/payer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify(paymentData)
            });

            if (response.ok) {
                Alert.alert('Succès', 'Paiement effectué avec succès !');
                fermerModalPaiement();
                fetchReservations(0, 10); // Recharger la liste
            } else {
                const errorData = await response.text();
                throw new Error(`Erreur lors du paiement: ${response.status}`);
            }
        } catch (error) {
            console.error('Erreur paiement:', error);
            Alert.alert('Erreur', 'Erreur lors du paiement. Veuillez réessayer.');
        } finally {
            setPaymentLoading(false);
        }
    };

    // Fonction pour ouvrir le modal d'annulation
    const ouvrirModalAnnulation = (reservation) => {
        setSelectedReservation(reservation);
        setCauseAnnulation('');
        setOrigineAnnulation('CLIENT');
        setShowCancelModal(true);
    };

    // Fonction pour fermer le modal d'annulation
    const fermerModalAnnulation = () => {
        setShowCancelModal(false);
        setSelectedReservation(null);
        setCauseAnnulation('');
        setOrigineAnnulation('CLIENT');
    };

    // Fonction pour effectuer l'annulation
    const effectuerAnnulation = async () => {
        if (!causeAnnulation.trim()) {
            Alert.alert('Erreur', 'Veuillez indiquer la cause de l\'annulation');
            return;
        }

        try {
            setCancelLoading(true);
            
            const cancelData = {
                causeAnnulation: causeAnnulation.trim(),
                origineAnnulation: origineAnnulation,
                idReservation: selectedReservation.reservation.idReservation,
                idPassagers: [userData?.userId || '3fa85f64-5717-4562-b3fc-2c963f66afa6'],
                canceled: true
            };

            const response = await fetch('http://agence-voyage.ddns.net/api/reservation/annuler', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify(cancelData)
            });

            if (response.status == 200) {
                console.log(response.status);
                Alert.alert('Succès', 'Réservation annulée avec succès !');
                fermerModalAnnulation();
                fetchReservations(0, 10);
            } else if(response.status == 400) {
                const data = await response.text();
                console.log(data);
                throw new Error(`Erreur lors de l'annulation: ${response.status}`);
            } else {
                const errorData = await response.text();
                throw new Error(`Erreur lors de l'annulation: ${response.status}`);
            }
        } catch (error) {
            console.error('Erreur annulation:', error);
            Alert.alert('Erreur', 'Erreur lors de l\'annulation.');
        } finally {
            setCancelLoading(false);
        }
    };

    // Charger les réservations au montage du composant
    useEffect(() => {
        fetchReservations(0, 10);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'CONFIRMER':
                return '#10B981';
            case 'RESERVER':
                return '#F59E0B';
            case 'ANNULER':
                return '#EF4444';
            default:
                return '#6B7280';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return '#10B981';
            case 'FAILED':
                return '#EF4444';
            default:
                return '#F59E0B';
        }
    };

    const ReservationCard = ({ item }) => (
        <View style={styles.reservationCard}>
            <View style={styles.cardHeader}>
                <View style={styles.agencyInfo}>
                    <View style={styles.agencyInitials}>
                        <Text style={styles.initialsText}>
                            {getInitials(item.agence?.shortName || item.agence?.longName || 'AG')}
                        </Text>
                    </View>
                    <View style={styles.agencyDetails}>
                        <Text style={styles.agencyName}>
                            {item.agence?.longName || 'Agence inconnue'}
                        </Text>
                        <Text style={styles.reservationDate}>
                            Réservé le {formatDate(item.reservation.dateReservation)}
                        </Text>
                    </View>
                </View>
                <View style={styles.priceSection}>
                    <Text style={styles.price}>{item.reservation.prixTotal.toLocaleString()} FCFA</Text>
                    <Text style={styles.passengersCount}>
                        {item.reservation.nbrPassager} passager{item.reservation.nbrPassager > 1 ? 's' : ''}
                    </Text>
                </View>
            </View>
            
            <View style={styles.journeyInfo}>
                <Text style={styles.journeyText}>
                    De {item.voyage.lieuDepart} à {item.voyage.lieuArrive}
                </Text>
                <Text style={styles.journeyDate}>
                    Départ prévu: {formatDate(item.voyage.dateDepartPrev)}
                </Text>
                <Text style={styles.reservationDate}>
                    Date limite de la reservation {formatDate(item.voyage.dateLimiteReservation)}
                </Text>
                <Text style = {styles.journeyDate}>
                    Destination de départ : {item.voyage.pointDeDepart}
                </Text>
                <Text style = {styles.journeyDate}>
                    Destination d'arrivée : {item.voyage.pointArrivee}
                </Text>
                <Text style = {styles.journeyDate}>
                    Durée approximative du voyage : {formatTime(item.voyage.dureeVoyage)}
                </Text>   
            </View>

            <View style={styles.statusRow}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.reservation.statutReservation) }]}>
                    <Text style={styles.statusText}>{item.reservation.statutReservation}</Text>
                </View>
                <View style={[styles.paymentBadge, { backgroundColor: getPaymentStatusColor(item.reservation.statutPayement) }]}>
                    <Text style={styles.paymentText}>{item.reservation.statutPayement}</Text>
                </View>
            </View>

            <Text style={styles.transactionCode}>
                Code: {item.reservation.transactionCode || 'N/A'}
            </Text>
            
            <View style={styles.cardFooter}>
                {item.reservation.statutPayement === 'NO_PAYMENT' && (
                    <TouchableOpacity 
                        style={styles.payButton} 
                        onPress={() => ouvrirModalPaiement(item)}
                    >
                        <Icon name="payment" size={25} color="white" />
                        <Text style={styles.payButtonText}>Payer</Text>
                    </TouchableOpacity>
                )}
                {item.reservation.statutReservation !== 'ANNULER' && (
                    <TouchableOpacity 
                        style={styles.cancelButton} 
                        onPress={() => annulerReservation(item)}
                    >
                        <Text style={styles.cancelButtonText}>Annuler</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#28068E" />
            
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mes Réservations</Text>
                <TouchableOpacity 
                    style={styles.refreshButton} 
                    onPress={() => fetchReservations(0, 10)}
                >
                    <Text style={styles.refreshText}>↻</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Stats */}
                <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>
                        {reservations.length} réservation{reservations.length > 1 ? 's' : ''} trouvée{reservations.length > 1 ? 's' : ''}
                    </Text>
                </View>

                {/* Loading indicator */}
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#28068E" />
                        <Text style={styles.loadingText}>Chargement de vos réservations...</Text>
                    </View>
                ) : (
                    /* Reservations list */
                    <View style={styles.reservationsList}>
                        {reservations.length > 0 ? (
                            reservations.map((item, index) => (
                                <ReservationCard key={item.reservation.idReservation || index} item={item} />
                            ))
                        ) : (
                            <View style={styles.noReservationsContainer}>
                                <Icon name="event-busy" size={64} color="#ccc" />
                                <Text style={styles.noReservationsText}>
                                    Aucune réservation trouvée
                                </Text>
                                <Text style={styles.noReservationsSubtext}>
                                    Vos réservations apparaîtront ici une fois effectuées
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.bottomNavItem} onPress={navigateToHome}>
                    <FontAwesome name="home" size={25} color="#666" />
                    <Text style={styles.bottomNavText}>Accueil</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.bottomNavItem} onPress={(tickets)}>
                    <FontAwesome name="ticket" size={25} color="#666" />
                    <Text style={styles.bottomNavText}>Billets</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.bottomNavItem} disabled={true}>
                    <FontAwesome name="bus" size={25} color="#28068E" />
                    <Text style={[styles.bottomNavText, styles.bottomNavTextActive]}>Reservations</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.bottomNavItem}>
                    <FontAwesome name="bell-o" size={25} color="#666" />
                    <Text style={styles.bottomNavText}>Notification</Text>
                </TouchableOpacity>
            </View>

            {/* Modal d'annulation */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showCancelModal}
                onRequestClose={fermerModalAnnulation}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Annuler la réservation</Text>
                            <TouchableOpacity onPress={fermerModalAnnulation}>
                                <Icon name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {selectedReservation && (
                            <View style={styles.reservationSummary}>
                                <Text style={styles.summaryTitle}>Réservation à annuler</Text>
                                <Text style={styles.summaryText}>
                                    {selectedReservation.agence?.longName} : De {selectedReservation.voyage.lieuDepart} à {selectedReservation.voyage.lieuArrive}
                                </Text>
                                <Text style={styles.summaryAmount}>
                                    Montant: {selectedReservation.reservation.prixTotal.toLocaleString()} FCFA
                                </Text>
                            </View>
                        )}

                        <View style={styles.paymentForm}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Origine de l'annulation *</Text>
                                <View style={styles.pickerContainer}>
                                    <TouchableOpacity 
                                        style={[styles.pickerOption, origineAnnulation === 'CLIENT' && styles.pickerOptionSelected]}
                                        onPress={() => setOrigineAnnulation('CLIENT')}
                                    >
                                        <Text style={[styles.pickerText, origineAnnulation === 'CLIENT' && styles.pickerTextSelected]}>
                                            Client
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[styles.pickerOption, origineAnnulation === 'AGENCE' && styles.pickerOptionSelected]}
                                        onPress={() => setOrigineAnnulation('AGENCE')}
                                    >
                                        <Text style={[styles.pickerText, origineAnnulation === 'AGENCE' && styles.pickerTextSelected]}>
                                            Agence
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Motif de l'annulation *</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Expliquez pourquoi vous annulez cette réservation..."
                                    value={causeAnnulation}
                                    onChangeText={setCauseAnnulation}
                                    multiline={true}
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />
                            </View>
                        </View>

                        <View style={styles.modalActions}>                            
                            <TouchableOpacity 
                                style={[styles.confirmCancelButton, cancelLoading && styles.confirmButtonDisabled]} 
                                onPress={effectuerAnnulation}
                                disabled={cancelLoading}
                            >
                                {cancelLoading ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Text style={styles.confirmCancelButtonText}>Confirmer l'annulation</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal de paiement */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showPaymentModal}
                onRequestClose={fermerModalPaiement}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Paiement</Text>
                            <TouchableOpacity onPress={fermerModalPaiement}>
                                <Icon name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {selectedReservation && (
                            <View style={styles.reservationSummary}>
                                <Text style={styles.summaryTitle}>Résumé de la réservation</Text>
                                <Text style={styles.summaryText}>
                                    {selectedReservation.agence?.longName} : De {selectedReservation.voyage.lieuDepart} à {selectedReservation.voyage.lieuArrive}
                                </Text>
                                <Text style={styles.summaryAmount}>
                                    Montant à payer: {selectedReservation.reservation.prixTotal.toLocaleString()} FCFA
                                </Text>
                            </View>
                        )}

                        <View style={styles.paymentForm}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Numéro de téléphone *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ex: 6XX XXX XXX"
                                    value={mobilePhone}
                                    onChangeText={setMobilePhone}
                                    keyboardType="phone-pad"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Nom du propriétaire *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nom complet du propriétaire du numéro"
                                    value={mobilePhoneName}
                                    onChangeText={setMobilePhoneName}
                                />
                            </View>

                            <Text style={styles.paymentInfo}>
                                Une demande de paiement sera envoyée sur ce numéro pour valider le paiement
                            </Text>
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity 
                                style={[styles.confirmButton, paymentLoading && styles.confirmButtonDisabled]} 
                                onPress={effectuerPaiement}
                                disabled={paymentLoading}
                            >
                                {paymentLoading ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Text style={styles.confirmButtonText}>Confirmer le paiement</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#28068E',
        paddingVertical: 15,
        paddingHorizontal: 20,
        paddingLeft: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    backButton: {
        backgroundColor: '#ffffffac',
        padding: 5,
        borderRadius: 10,
    },
    image_retour: {
        width: 20,
        height: 20,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
    },
    refreshButton: {
        backgroundColor: '#ffffffac',
        borderRadius: 10,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    refreshText: {
        marginTop: -5,
        color: '#28068E',
        fontSize: 25,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 10,
    },
    statsContainer: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    statsText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    noReservationsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
        paddingHorizontal: 20,
    },
    noReservationsText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 8,
        fontWeight: '600',
    },
    noReservationsSubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    reservationsList: {
        padding: 20,
    },
    reservationCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 15,
        paddingBottom : -60,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    agencyInfo: {
        flexDirection: 'row',
        flex: 1,
    },
    agencyInitials: {
        width: 45,
        height: 45,
        borderRadius: 8,
        backgroundColor: '#28068E',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    initialsText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    agencyDetails: {
        flex: 1,
    },
    agencyName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        color: '#333',
    },
    reservationDate: {
        fontSize: 12,
        color: '#666',
    },
    priceSection: {
        alignItems: 'flex-end',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#28068E',
        marginBottom: 3,
    },
    passengersCount: {
        fontSize: 12,
        color: '#666',
    },
    journeyInfo: {
        marginBottom: 15,
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 6,
    },
    journeyText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    journeyDate: {
        fontSize: 12,
        color: '#666',
    },
    statusRow: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 10,
    },
    statusText: {
        fontSize: 11,
        color: 'white',
        fontWeight: '600',
    },
    paymentBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    paymentText: {
        fontSize: 11,
        color: 'white',
        fontWeight: '600',
    },
    cardFooter: {
        flex : 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch', 
        paddingBottom : 16,
    },
    transactionCode: {
        fontSize: 12,
        color: '#666',
        flex: 1,
        paddingBottom : 10,
    },
    actionButtons: {
        flexDirection: 'column',
    },
    payButton: {
        backgroundColor: '#10B981',
        justifyContent :'center',
        flexDirection : 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 6,
        marginBottom: 10,
    },
    payButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    cancelButton: {
        width: 400,
        backgroundColor: '#EF4444',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        marginLeft: 8,
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    // Bottom Navigation Styles
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    bottomNavItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    bottomNavText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#666',
        marginTop: 4,
    },
    bottomNavTextActive: {
        color: '#28068E',
    },
    // Modal de paiement styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        width: '90%',
        maxWidth: 400,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    reservationSummary: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
    },
    summaryTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    summaryText: {
        fontSize: 13,
        color: '#666',
        marginBottom: 8,
    },
    summaryAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#28068E',
    },
    paymentForm: {
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: 'white',
    },
    paymentInfo: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
        backgroundColor: '#e8f4fd',
        padding: 10,
        borderRadius: 6,
        marginTop: 10,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#ff0000',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
    },
    confirmButton: {
        flex: 1,
        backgroundColor: '#28068E',
        paddingVertical: 12,
        borderRadius: 8,
        marginLeft: 10,
        alignItems: 'center',
    },
    confirmButtonDisabled: {
        backgroundColor: '#ccc',
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    // Styles spécifiques pour l'annulation
    pickerContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
    },
    pickerOption: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    pickerOptionSelected: {
        backgroundColor: '#28068E',
    },
    pickerText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    pickerTextSelected: {
        color: 'white',
        fontWeight: '600',
    },
    textArea: {
        height: 80,
        paddingTop: 10,
    },
    confirmCancelButton: {
        flex: 1,
        backgroundColor: '#ff0000',
        paddingVertical: 12,
        borderRadius: 8,
        marginLeft: 10,
        alignItems: 'center',
    },
    confirmCancelButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ReservationsPage;