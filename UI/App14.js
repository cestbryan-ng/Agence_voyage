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
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ReservationsPage = ({ navigation, route }) => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0
    });

    // Récupérer les données utilisateur depuis les paramètres de route
    const { userData, token, nom_envoye } = route.params || {};

    function retour() {
        navigation.navigate('App8', {
            nom_envoye: nom_envoye,
            userData: userData,
            token: token
        });
    }

    // Fonctions de navigation pour la barre de navigation
    const navigateToHome = () => {
        navigation.navigate('App8', {
            nom_envoye: nom_envoye,
            userData: userData,
            token: token
        });
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

    // Fonction pour récupérer les réservations depuis l'API
    const fetchReservations = async (page = 0, size = 10) => {
        try {
            setLoading(true);
            
            // Utiliser l'ID utilisateur depuis userData
            const userId = userData?.userId || '3fa85f64-5717-4562-b3fc-2c963f66afa6';
            
            const response = await fetch(`http://agence-voyage.ddns.net/api/reservation/utilisateur/${userId}?page=${page}&size=${size}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                
                setReservations(data);
                setPagination({
                    currentPage: page,
                    totalPages: Math.ceil(data.length / size),
                    totalElements: data.length
                });
            } else {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

        } catch (error) {
            console.error('Erreur lors de la récupération des réservations:', error);
            Alert.alert(
                'Erreur', 
                'Impossible de charger vos réservations.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour payer une réservation
    const payerReservation = async (reservation) => {
        Alert.alert(
            'Paiement',
            `Confirmer le paiement de ${reservation.reservation.prixTotal} FCFA ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                { 
                    text: 'Payer', 
                    onPress: async () => {
                        try {
                            // Appel API pour payer
                            const response = await fetch('http://agence-voyage.ddns.net/api/reservation/payer', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({
                                    idReservation: reservation.reservation.idReservation,
                                    montant: reservation.reservation.prixTotal
                                })
                            });

                            if (response.ok) {
                                Alert.alert('Succès', 'Paiement effectué avec succès !');
                                fetchReservations(); // Recharger la liste
                            } else {
                                throw new Error('Erreur lors du paiement');
                            }
                        } catch (error) {
                            Alert.alert('Erreur', 'Erreur lors du paiement. Veuillez réessayer.');
                        }
                    }
                }
            ]
        );
    };

    // Fonction pour annuler une réservation
    const annulerReservation = async (reservation) => {
        Alert.alert(
            'Annulation',
            'Êtes-vous sûr de vouloir annuler cette réservation ?',
            [
                { text: 'Non', style: 'cancel' },
                { 
                    text: 'Oui, annuler', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Appel API pour annuler (ajustez l'endpoint selon votre API)
                            const response = await fetch(`http://agence-voyage.ddns.net/api/reservation/${reservation.reservation.idReservation}/annuler`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                }
                            });

                            if (response.ok) {
                                Alert.alert('Succès', 'Réservation annulée avec succès !');
                                fetchReservations(); // Recharger la liste
                            } else {
                                throw new Error('Erreur lors de l\'annulation');
                            }
                        } catch (error) {
                            Alert.alert('Erreur', 'Erreur lors de l\'annulation. Veuillez réessayer.');
                        }
                    }
                }
            ]
        );
    };

    // Charger les réservations au montage du composant
    useEffect(() => {
        fetchReservations(0, 10);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'RESERVER':
                return '#F59E0B';
            default:
                return '#f30b0b';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return '#F59E0B';
            default:
                return '#6B7280';
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
                    {item.voyage.lieuDepart} → {item.voyage.lieuArrive}
                </Text>
                <Text style={styles.journeyDate}>
                    Départ prévu: {formatDate(item.voyage.dateDepartPrev)}
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
            
            <View style={styles.cardFooter}>
                <Text style={styles.transactionCode}>
                    Code: {item.reservation.transactionCode || 'N/A'}
                </Text>
                <View style={styles.actionButtons}>
                    {item.reservation.statutPayement === 'PENDING' && (
                        <TouchableOpacity 
                            style={styles.payButton} 
                            onPress={() => payerReservation(item)}
                        >
                            <Icon name="payment" size={16} color="white" />
                            <Text style={styles.payButtonText}>Payer</Text>
                        </TouchableOpacity>
                    )} 
                    <TouchableOpacity 
                        style={styles.cancelButton} 
                        onPress={() => annulerReservation(item)}
                    >
                        <Icon name="cancel" size={16} color="white" />
                        <Text style={styles.cancelButtonText}>Annuler</Text>
                    </TouchableOpacity>
                </View>
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
                
                <TouchableOpacity style={styles.bottomNavItem}>
                    <FontAwesome name="ticket" size={25} color="#666" />
                    <Text style={styles.bottomNavText}>Tickets</Text>
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
        paddingLeft : 50,
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
        paddingTop : 10,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    transactionCode: {
        fontSize: 12,
        color: '#666',
        flex: 1,
    },
    actionButtons: {
        flexDirection: 'row',
    },
    payButton: {
        backgroundColor: '#10B981',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        marginLeft: 8,
    },
    payButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    cancelButton: {
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
});

export default ReservationsPage;