import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const TicketsPage = ({ navigation, route }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const navigateToReservations = () => {
        navigation.navigate('App14', {
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

    // Fonction pour récupérer les tickets depuis l'API
    const fetchTickets = async () => {
        try {
            setLoading(true);
            
            // Utiliser l'ID utilisateur depuis userData
            const userId = userData?.userId || '3fa85f64-5717-4562-b3fc-2c963f66afa6';
            
            const response = await fetch(`http://agence-voyage.ddns.net/api/utilisateur/billet/${userId}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                
                // L'API retourne un objet unique, on le met dans un tableau pour l'affichage
                setTickets(Array.isArray(data) ? data : [data]);
            } else {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

        } catch (error) {
            console.error('Erreur lors de la récupération des tickets:', error);
            Alert.alert(
                'Erreur', 
                'Impossible de charger vos tickets.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Charger les tickets au montage du composant
    useEffect(() => {
        fetchTickets();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'EN_ATTENTE':
                return '#F59E0B';
            case 'CONFIRME':
                return '#10B981';
            case 'ANNULE':
                return '#EF4444';
            default:
                return '#6B7280';
        }
    };

    const TicketCard = ({ item, index }) => (
        <View style={styles.ticketCard}>
            <View style={styles.cardHeader}>
                <View style={styles.agencyInfo}>
                    <View style={styles.agencyInitials}>
                        <Text style={styles.initialsText}>
                            {getInitials(item.nomAgence || 'AG')}
                        </Text>
                    </View>
                    <View style={styles.agencyDetails}>
                        <Text style={styles.agencyName}>
                            {item.nomAgence || 'Agence inconnue'}
                        </Text>
                        <Text style={styles.ticketClass}>
                            Classe {item.nomClasseVoyage || 'Standard'}
                        </Text>
                    </View>
                </View>
                <View style={styles.priceSection}>
                    <Text style={styles.price}>{item.prix?.toLocaleString() || '0'} FCFA</Text>
                    <Text style={styles.seatNumber}>
                        Place {item.placeChoisis || 'N/A'}
                    </Text>
                </View>
            </View>
            
            <View style={styles.journeyInfo}>
                <Text style={styles.journeyText}>
                    {item.lieuDepart || 'Départ'} → {item.lieuArrive || 'Arrivée'}
                </Text>
                <View style={styles.journeyDetails}>
                    <Text style={styles.journeyDate}>
                        Départ prévu: {formatDate(item.dateDepartPrev)}
                    </Text>
                    {item.dateDepartEffectif && (
                        <Text style={styles.journeyDate}>
                            Départ effectif: {formatDate(item.dateDepartEffectif)}
                        </Text>
                    )}
                </View>
            </View>

            {/* Informations passager */}
            <View style={styles.passengerInfo}>
                <Text style={styles.passengerTitle}>Informations passager</Text>
                <View style={styles.passengerDetails}>
                    <Text style={styles.passengerText}>
                        <Text style={styles.label}>Nom:</Text> {item.nom || 'N/A'}
                    </Text>
                    <Text style={styles.passengerText}>
                        <Text style={styles.label}>Genre:</Text> {item.genre || 'N/A'}
                    </Text>
                    <Text style={styles.passengerText}>
                        <Text style={styles.label}>Âge:</Text> {item.age || 'N/A'} ans
                    </Text>
                    <Text style={styles.passengerText}>
                        <Text style={styles.label}>Pièce d'identité:</Text> {item.numeroPieceIdentific || 'N/A'}
                    </Text>
                    {item.nbrBaggage > 0 && (
                        <Text style={styles.passengerText}>
                            <Text style={styles.label}>Bagages:</Text> {item.nbrBaggage}
                        </Text>
                    )}
                </View>
            </View>

            <View style={styles.statusRow}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.statusVoyage) }]}>
                    <Text style={styles.statusText}>{item.statusVoyage || 'EN_ATTENTE'}</Text>
                </View>
                {item.pointDeDepart && (
                    <Text style={styles.pointInfo}>
                        Point départ: {item.pointDeDepart}
                    </Text>
                )}
            </View>
            
            {item.titre && (
                <View style={styles.cardFooter}>
                    <Text style={styles.ticketTitle}>
                        {item.titre}
                    </Text>
                    {item.description && (
                        <Text style={styles.ticketDescription}>
                            {item.description}
                        </Text>
                    )}
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#28068E" />
            
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mes Tickets</Text>
                <TouchableOpacity 
                    style={styles.refreshButton} 
                    onPress={fetchTickets}
                >
                    <Text style={styles.refreshText}>↻</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Stats */}
                <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>
                        {tickets.length} ticket{tickets.length > 1 ? 's' : ''} trouvé{tickets.length > 1 ? 's' : ''}
                    </Text>
                </View>

                {/* Loading indicator */}
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#28068E" />
                        <Text style={styles.loadingText}>Chargement de vos tickets...</Text>
                    </View>
                ) : (
                    /* Tickets list */
                    <View style={styles.ticketsList}>
                        {tickets.length > 0 ? (
                            tickets.map((item, index) => (
                                <TicketCard key={index} item={item} index={index} />
                            ))
                        ) : (
                            <View style={styles.noTicketsContainer}>
                                <Icon name="confirmation-number" size={64} color="#ccc" />
                                <Text style={styles.noTicketsText}>
                                    Aucun ticket trouvé
                                </Text>
                                <Text style={styles.noTicketsSubtext}>
                                    Vos tickets apparaîtront ici une fois générés
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
                
                <TouchableOpacity style={styles.bottomNavItem} disabled={true}>
                    <FontAwesome name="ticket" size={25} color="#28068E" />
                    <Text style={[styles.bottomNavText, styles.bottomNavTextActive]}>Tickets</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.bottomNavItem} onPress={navigateToReservations}>
                    <FontAwesome name="bus" size={25} color="#666" />
                    <Text style={styles.bottomNavText}>Reservations</Text>
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
    noTicketsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
        paddingHorizontal: 20,
    },
    noTicketsText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 8,
        fontWeight: '600',
    },
    noTicketsSubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    ticketsList: {
        padding: 20,
    },
    ticketCard: {
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
    ticketClass: {
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
    seatNumber: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
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
        marginBottom: 8,
    },
    journeyDetails: {
        gap: 4,
    },
    journeyDate: {
        fontSize: 12,
        color: '#666',
    },
    passengerInfo: {
        marginBottom: 15,
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#e8f4fd',
        borderRadius: 6,
    },
    passengerTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    passengerDetails: {
        gap: 4,
    },
    passengerText: {
        fontSize: 12,
        color: '#555',
    },
    label: {
        fontWeight: '600',
        color: '#333',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
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
    pointInfo: {
        fontSize: 12,
        color: '#666',
        flex: 1,
    },
    cardFooter: {
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingTop: 10,
    },
    ticketTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    ticketDescription: {
        fontSize: 12,
        color: '#666',
        lineHeight: 16,
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

export default TicketsPage;