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
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const HistoriqueReservationsPage = ({ navigation, route }) => {
    const [historiques, setHistoriques] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

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

    const navigateToNotifications = () => {
        Alert.alert('Info', 'Page Notifications en cours de développement');
    };

    const tickets = () => {
        navigation.navigate('App15', {
            token: token,
            userData: userData,
            nom_envoye: nom_envoye
        });
    };

    const reservations = () => {
        navigation.navigate('App14', {
            token: token,
            userData: userData,
            nom_envoye: nom_envoye
        });
    };

    // Fonction pour formater la date
    const formatDate = (dateString) => {
        if (!dateString) return 'Non définie';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Fonction pour obtenir la couleur selon le statut
    const getStatusColor = (status) => {
        switch (status) {
            case 'ANNULER_PAR_AGENCE_APRES_RESERVATION':
                return '#EF4444';
            case 'ANNULER_PAR_USAGER_APRES_RESERVATION':
                return '#F59E0B';
            case 'ANNULER_PAR_AGENCE_APRES_CONFIRMATION' :
                return '#EF4444';
            case 'ANNULER_PAR_USAGER_APRES_CONFIRMATION' :
                return '#F59E0B';
            case 'VALIDER':
                return '#3B82F6';
            default:
                return '#6B7280';
        }
    };

    // Fonction pour obtenir le libellé du statut
    const getStatusLabel = (status) => {
        switch (status) {
            case 'ANNULER_PAR_AGENCE_APRES_RESERVATION':
                return 'Annulé par l\'agence';
            case 'ANNULER_PAR_USAGER_APRES_RESERVATION':
                return 'Annulé par le client';
            case 'ANNULER_PAR_AGENCE_APRES_CONFIRMATION':
                return 'Annulé par l\'agence';
            case 'ANNULER_PAR_USAGER_APRES_CONFIRMATION' :
                return 'Annulé par le client';
            case 'VALIDER':
                return 'Reservation faite';
            default:
                return status;
        }
    };

    // Fonction pour obtenir l'icône selon le statut
    const getStatusIcon = (status) => {
        switch (status) {
            case 'ANNULER_PAR_AGENCE_APRES_RESERVATION':
            case 'ANNULER_PAR_USAGER_APRES_RESERVATION':
            case 'ANNULER_PAR_AGENCE_APRES_CONFIRMATION' :
            case 'ANNULER_PAR_USAGER_APRES_CONFIRMATION' :
                return 'cancel';
            case 'VALIDER':
                return 'list-alt';
            default:
                return 'info';
        }
    };

    // Fonction pour récupérer les historiques depuis l'API
    const fetchHistoriques = async () => {
        try {
            setLoading(true);
            
            // Utiliser l'ID utilisateur depuis userData
            const userId =  userData?.userId ;
            
            const response = await fetch(`http://agence-voyage.ddns.net/api/historique/reservation/${userId}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            });

            if (response.status === 200) {
                const data = await response.json();
                setHistoriques(Array.isArray(data) ? data : []);
            } else {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

        } catch (error) {
            console.error('Erreur lors de la récupération des historiques:', error);
            setHistoriques([]);
            Alert.alert(
                'Erreur', 
                'Impossible de charger l\'historique de vos réservations. Vérifiez votre connexion internet.'
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Fonction de rafraîchissement
    const onRefresh = () => {
        setRefreshing(true);
        fetchHistoriques();
    };

    // Charger les historiques au montage du composant
    useEffect(() => {
        fetchHistoriques();
    }, []);

    const HistoriqueCard = ({ item }) => (
        <View style={styles.historiqueCard}>
            <View style={styles.cardHeader}>
                <View style={styles.statusInfo}>
                    <View style={styles.statusIconContainer}>
                        <Icon 
                            name={getStatusIcon(item.statusHistorique)} 
                            size={24} 
                            color={getStatusColor(item.statusHistorique)} 
                        />
                    </View>
                    <View style={styles.statusDetails}>
                        <Text style={styles.statusTitle}>
                            {getStatusLabel(item.statusHistorique)}
                        </Text>
                        <Text style={styles.reservationId}>
                            Réservation: {item.idReservation?.substring(0, 8)}...
                        </Text>
                    </View>
                </View>
                <View style={styles.dateSection}>
                    <Text style={styles.mainDate}>{formatDate(item.dateReservation)}</Text>
                    <Text style={styles.dateLabel}>Date de réservation</Text>
                </View>
            </View>
            
            <View style={styles.timelineInfo}>
                {item.dateConfirmation && (
                    <View style={styles.timelineItem}>
                        <Icon name="check-circle" size={16} color="#10B981" />
                        <Text style={styles.timelineText}>
                            Confirmé le {formatDate(item.dateConfirmation)}
                        </Text>
                    </View>
                )}
                {item.dateAnnulation && (
                    <View style={styles.timelineItem}>
                        <Icon name="cancel" size={16} color="#EF4444" />
                        <Text style={styles.timelineText}>
                            Annulé le {formatDate(item.dateAnnulation)}
                        </Text>
                    </View>
                )}
            </View>

            {item.causeAnnulation && (
                <View style={styles.cancellationInfo}>
                    <Text style={styles.cancellationTitle}>Motif d'annulation:</Text>
                    <Text style={styles.cancellationText}>{item.causeAnnulation}</Text>
                    <Text style={styles.cancellationOrigin}>
                        Origine: {item.origineAnnulation}
                    </Text>
                </View>
            )}

            {(item.tauxAnnulation > 0 || item.compensation > 0) && (
                <View style={styles.financialInfo}>
                    {item.tauxAnnulation > 0 && (
                        <View style={styles.financialItem}>
                            <Text style={styles.financialLabel}>Taux d'annulation:</Text>
                            <Text style={styles.financialValue}>{(item.tauxAnnulation * 100).toFixed(1)}%</Text>
                        </View>
                    )}
                    {item.compensation > 0 && (
                        <View style={styles.financialItem}>
                            <Text style={styles.financialLabel}>Compensation:</Text>
                            <Text style={styles.financialValue}>{item.compensation.toLocaleString()} FCFA</Text>
                        </View>
                    )}
                </View>
            )}

            <View style={styles.statusRow}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.statusHistorique) }]}>
                    <Text style={styles.statusText}>{getStatusLabel(item.statusHistorique)}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#28068E" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={retour}>
                    <Icon name="arrow-back" size={20} color="#28068E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Historique des Réservations</Text>
                <TouchableOpacity 
                    style={styles.refreshButton} 
                    onPress={() => fetchHistoriques()}
                >
                    <Text style={styles.refreshText}>↻</Text>
                </TouchableOpacity>
            </View>

            <ScrollView 
                style={styles.content} 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#28068E']}
                    />
                }
            >
                {/* Stats */}
                <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>
                        {historiques.length} événement{historiques.length > 1 ? 's' : ''} trouvé{historiques.length > 1 ? 's' : ''}
                    </Text>
                </View>

                {/* Loading indicator */}
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#28068E" />
                        <Text style={styles.loadingText}>Chargement de l'historique...</Text>
                    </View>
                ) : (
                    /* Historiques list */
                    <View style={styles.historiquesList}>
                        {historiques.length > 0 ? (
                            historiques.map((item, index) => (
                                <HistoriqueCard key={item.idHistorique || index} item={item} />
                            ))
                        ) : (
                            <View style={styles.noHistoriquesContainer}>
                                <Icon name="history" size={64} color="#ccc" />
                                <Text style={styles.noHistoriquesText}>
                                    Aucun historique trouvé
                                </Text>
                                <Text style={styles.noHistoriquesSubtext}>
                                    L'historique de vos réservations apparaîtra ici
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
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
        padding: 8,
        borderRadius: 10,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 10,
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
    noHistoriquesContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
        paddingHorizontal: 20,
    },
    noHistoriquesText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 8,
        fontWeight: '600',
    },
    noHistoriquesSubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    historiquesList: {
        padding: 20,
    },
    historiqueCard: {
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
    statusInfo: {
        flexDirection: 'row',
        flex: 1,
    },
    statusIconContainer: {
        width: 45,
        height: 45,
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    statusDetails: {
        flex: 1,
    },
    statusTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        color: '#333',
    },
    reservationId: {
        fontSize: 12,
        color: '#666',
    },
    dateSection: {
        alignItems: 'flex-end',
    },
    mainDate: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#28068E',
        marginBottom: 3,
    },
    dateLabel: {
        fontSize: 11,
        color: '#666',
    },
    timelineInfo: {
        marginBottom: 15,
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 6,
    },
    timelineItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    timelineText: {
        fontSize: 13,
        color: '#666',
        marginLeft: 8,
    },
    cancellationInfo: {
        marginBottom: 15,
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#fef2f2',
        borderRadius: 6,
        borderLeftWidth: 3,
        borderLeftColor: '#EF4444',
    },
    cancellationTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#7f1d1d',
        marginBottom: 4,
    },
    cancellationText: {
        fontSize: 13,
        color: '#991b1b',
        marginBottom: 4,
    },
    cancellationOrigin: {
        fontSize: 11,
        color: '#7f1d1d',
        fontStyle: 'italic',
    },
    financialInfo: {
        marginBottom: 15,
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#eff6ff',
        borderRadius: 6,
        borderLeftWidth: 3,
        borderLeftColor: '#3B82F6',
    },
    financialItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    financialLabel: {
        fontSize: 13,
        color: '#1e40af',
        fontWeight: '500',
    },
    financialValue: {
        fontSize: 13,
        color: '#1d4ed8',
        fontWeight: '600',
    },
    statusRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 11,
        color: 'white',
        fontWeight: '600',
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

export default HistoriqueReservationsPage;