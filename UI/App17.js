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
  Alert,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const CouponsPage = ({ navigation, route }) => {
    const [coupons, setCoupons] = useState([]);
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

    const historique = () => {
        navigation.navigate('App16', {
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
            year: 'numeric'
        });
    };

    // Fonction pour formater la valeur du coupon
    const formatCouponValue = (valeur) => {
        if (valeur < 1) {
            // Si c'est un pourcentage (valeur entre 0 et 1)
            return `${(valeur * 100).toFixed(0)}%`;
        } else {
            // Si c'est un montant fixe
            return `${valeur.toLocaleString()} FCFA`;
        }
    };

    // Fonction pour obtenir la couleur selon le statut
    const getStatusColor = (status) => {
        switch (status) {
            case 'VALIDE':
                return '#10B981';
            case 'EXPIRE':
                return '#EF4444';
            case 'UTILISE':
                return '#6B7280';
            case 'SUSPENDU':
                return '#F59E0B';
            default:
                return '#6B7280';
        }
    };

    // Fonction pour obtenir le libellé du statut
    const getStatusLabel = (status) => {
        switch (status) {
            case 'VALIDE':
                return 'Valide';
            case 'EXPIRE':
                return 'Expiré';
            case 'UTILISE':
                return 'Utilisé';
            case 'SUSPENDU':
                return 'Suspendu';
            default:
                return status;
        }
    };

    // Fonction pour obtenir l'icône selon le statut
    const getStatusIcon = (status) => {
        switch (status) {
            case 'VALIDE':
                return 'check-circle';
            case 'EXPIRE':
                return 'schedule';
            case 'UTILISE':
                return 'done';
            case 'SUSPENDU':
                return 'pause-circle-filled';
            default:
                return 'local-offer';
        }
    };

    // Fonction pour vérifier si le coupon est expiré
    const isExpired = (dateFin) => {
        return new Date(dateFin) < new Date();
    };

    // Fonction pour récupérer les coupons depuis l'API
    const fetchCoupons = async () => {
        try {
            setLoading(true);
            
            // Utiliser l'ID utilisateur depuis userData
            const userId = userData?.id || userData?.userId || '3fa85f64-5717-4562-b3fc-2c963f66afa6';
            
            const response = await fetch(`http://agence-voyage.ddns.net/api/coupon/user/${userId}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            });

            if (response.status === 200) {
                const data = await response.json();
                setCoupons(Array.isArray(data) ? data : []);
            } else {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

        } catch (error) {
            console.error('Erreur lors de la récupération des coupons:', error);
            setCoupons([]);
            Alert.alert(
                'Erreur', 
                'Impossible de charger vos coupons. Vérifiez votre connexion internet.'
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Fonction de rafraîchissement
    const onRefresh = () => {
        setRefreshing(true);
        fetchCoupons();
    };

    // Charger les coupons au montage du composant
    useEffect(() => {
        fetchCoupons();
    }, []);

    const CouponCard = ({ item }) => {
        const expired = isExpired(item.dateFin);
        const currentStatus = expired && item.statusCoupon === 'VALIDE' ? 'EXPIRE' : item.statusCoupon;
        
        return (
            <View style={[
                styles.couponCard,
                currentStatus === 'VALIDE' && styles.couponCardValid,
                currentStatus === 'EXPIRE' && styles.couponCardExpired,
                currentStatus === 'UTILISER' && styles.couponCardUsed
            ]}>
                {/* Badge de valeur du coupon */}
                <View style={styles.couponHeader}>
                    <View style={styles.couponValueContainer}>
                        <Text style={styles.couponValueText}>
                            {formatCouponValue(item.valeur)}
                        </Text>
                        <Text style={styles.couponValueLabel}>
                            {item.valeur < 1 ? 'DE RÉDUCTION' : 'DE CRÉDIT'}
                        </Text>
                    </View>
                    <View style={styles.couponIconContainer}>
                        <Icon 
                            name={getStatusIcon(currentStatus)} 
                            size={32} 
                            color={getStatusColor(currentStatus)} 
                        />
                    </View>
                </View>

                {/* Informations de validité */}
                <View style={styles.validityInfo}>
                    <View style={styles.validityItem}>
                        <Icon name="event" size={16} color="#666" />
                        <Text style={styles.validityText}>
                            Valide du {formatDate(item.dateDebut)}
                        </Text>
                    </View>
                    <View style={styles.validityItem}>
                        <Icon name="event-busy" size={16} color="#666" />
                        <Text style={styles.validityText}>
                            Expire le {formatDate(item.dateFin)}
                        </Text>
                    </View>
                </View>

                {/* Identifiants */}
                <View style={styles.couponIds}>
                    <Text style={styles.couponIdText}>
                        ID: {item.idCoupon?.substring(0, 8)}...
                    </Text>
                    {item.idHistorique && (
                        <Text style={styles.couponIdText}>
                            Historique: {item.idHistorique?.substring(0, 8)}...
                        </Text>
                    )}
                </View>

                {/* Badge de statut */}
                <View style={styles.statusRow}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentStatus) }]}>
                        <Text style={styles.statusText}>{getStatusLabel(currentStatus)}</Text>
                    </View>
                    {currentStatus === 'VALIDE' && (
                        <TouchableOpacity style={styles.useCouponButton}>
                            <Icon name="redeem" size={16} color="white" />
                            <Text style={styles.useCouponText}>Utiliser</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Effet de coupon déchiré */}
                <View style={styles.couponPattern}>
                    <View style={styles.dottedLine}></View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#28068E" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={retour}>
                    <Icon name="arrow-back" size={20} color="#28068E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mes Coupons</Text>
                <TouchableOpacity 
                    style={styles.refreshButton} 
                    onPress={() => fetchCoupons()}
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
                        {coupons.length} coupon{coupons.length > 1 ? 's' : ''} trouvé{coupons.length > 1 ? 's' : ''}
                    </Text>
                    {coupons.length > 0 && (
                        <Text style={styles.validCouponsText}>
                            {coupons.filter(c => c.statusCoupon === 'VALIDE' && !isExpired(c.dateFin)).length} actif{coupons.filter(c => c.statusCoupon === 'VALIDE' && !isExpired(c.dateFin)).length > 1 ? 's' : ''}
                        </Text>
                    )}
                </View>

                {/* Loading indicator */}
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#28068E" />
                        <Text style={styles.loadingText}>Chargement de vos coupons...</Text>
                    </View>
                ) : (
                    /* Coupons list */
                    <View style={styles.couponsList}>
                        {coupons.length > 0 ? (
                            coupons.map((item, index) => (
                                <CouponCard key={item.idCoupon || index} item={item} />
                            ))
                        ) : (
                            <View style={styles.noCouponsContainer}>
                                <Icon name="local-offer" size={64} color="#ccc" />
                                <Text style={styles.noCouponsText}>
                                    Aucun coupon trouvé
                                </Text>
                                <Text style={styles.noCouponsSubtext}>
                                    Vos coupons de réduction apparaîtront ici
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statsText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
    validCouponsText: {
        fontSize: 14,
        color: '#10B981',
        fontWeight: '600',
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
    noCouponsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
        paddingHorizontal: 20,
    },
    noCouponsText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 8,
        fontWeight: '600',
    },
    noCouponsSubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    couponsList: {
        padding: 20,
    },
    couponCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 2,
        borderColor: '#e5e7eb',
        position: 'relative',
    },
    couponCardValid: {
        borderColor: '#10B981',
        backgroundColor: '#f0fdf4',
    },
    couponCardExpired: {
        borderColor: '#EF4444',
        backgroundColor: '#fef2f2',
        opacity: 0.8,
    },
    couponCardUsed: {
        borderColor: '#6B7280',
        backgroundColor: '#f9fafb',
        opacity: 0.7,
    },
    couponHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    couponValueContainer: {
        flex: 1,
    },
    couponValueText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#28068E',
        marginBottom: 2,
    },
    couponValueLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    couponIconContainer: {
        padding: 10,
    },
    validityInfo: {
        marginBottom: 15,
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 6,
    },
    validityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    validityText: {
        fontSize: 13,
        color: '#666',
        marginLeft: 8,
    },
    couponIds: {
        marginBottom: 15,
    },
    couponIdText: {
        fontSize: 11,
        color: '#999',
        marginBottom: 2,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    statusText: {
        fontSize: 12,
        color: 'white',
        fontWeight: '600',
    },
    useCouponButton: {
        backgroundColor: '#28068E',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    useCouponText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    couponPattern: {
        position: 'absolute',
        top: '60%',
        left: 0,
        right: 0,
        height: 1,
    },
    dottedLine: {
        height: 1,
        backgroundColor: '#ddd',
        marginHorizontal: -20,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#ddd',
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

export default CouponsPage;