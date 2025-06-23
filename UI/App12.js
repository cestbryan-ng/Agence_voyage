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

const SearchResultsPage = ({ navigation, route }) => {
    const { voyage, token, userData, nom_envoye } = route.params;
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState('Tous');
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0
    });

    function retour() {
        navigation.navigate('App8', {
            nom_envoye: nom_envoye,
            userData: userData,
            token: token
        });
    }

    function reserver(voyage) {
        // Passer l'objet voyage original de l'API à la page de réservation
        navigation.navigate('App10', {
            voyage : voyage,
            nom_envoye: nom_envoye,
            userData: userData,
            token: token
        })
    }

    // Fonction pour obtenir les initiales du nom de l'agence
    const getInitials = (nomAgence) => {
        return nomAgence
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Fonction pour convertir la durée ISO en format lisible
    const formatDuration = (duration) => {
        // Convertir PT8H30M en 8h 30min
        const match = duration.match(/PT(\d+)H(\d+)M/);
        if (match) {
            const hours = match[1];
            const minutes = match[2];
            return `${hours}h ${minutes}min`;
        }
        return duration;
    };

    // Fonction pour récupérer les voyages depuis l'API
    const fetchVoyages = async (page = 0, size = 10) => {
        try {
            setLoading(true);
            
            const response = await fetch(`http://agence-voyage.ddns.net/api/voyage/all?page=${page}&size=${size}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status == 200) {
                const data = await response.json();
                
                // Utiliser directement les données de l'API sans transformation
                setResults(data.content);
                setPagination({
                    currentPage: data.number,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements
                });
            } else {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

        } catch (error) {
            console.error('Erreur lors de la récupération des voyages:', error);
            Alert.alert(
                'Erreur', 
                'Impossible de charger les voyages. Vérifiez votre connexion internet.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Charger les voyages au montage du composant
    useEffect(() => {
        fetchVoyages(0, 20); // Charger plus de voyages pour avoir un bon échantillon
    }, []);

    // Filtrer les résultats selon le filtre sélectionné
    const filteredResults = results.filter(item => {
        if (selectedFilter === 'Tous') return true;
        return item.nomClasseVoyage === selectedFilter;
    });

    const filters = ['Tous', 'Classique', 'VIP'];

    const FilterButton = ({ title, isSelected }) => (
        <TouchableOpacity
            style={[
                styles.filterButton,
                isSelected && styles.filterButtonSelected
            ]}
            onPress={() => setSelectedFilter(title)}
        >
            <Text style={[
                styles.filterButtonText,
                isSelected && styles.filterButtonTextSelected
            ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );

    const ResultCard = ({ item }) => (
        <View style={styles.resultCard}>
            <View style={styles.cardHeader}>
                <View style={styles.companyInfo}>
                    <View style={styles.companyInitials}>
                        <Text style={styles.initialsText}>{getInitials(item.nomAgence)}</Text>
                    </View>
                    <View style={styles.companyDetails}>
                        <Text style={styles.companyName}>{item.nomAgence}</Text>
                        <View style={[styles.typeTag, item.nomClasseVoyage === 'VIP' && styles.vipTag]}>
                            <Text style={[styles.typeText, item.nomClasseVoyage === 'VIP' && styles.vipText]}>
                                {item.nomClasseVoyage}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.priceSection}>
                    <Text style={styles.price}>{item.prix.toLocaleString()} F</Text>
                    <Text style={styles.perPerson}>par personne</Text>
                    <Text style={styles.fromLocation}>De : {item.lieuDepart}</Text>
                    <Text style={styles.toLocation}>A : {item.lieuArrive}</Text>
                </View>
            </View>
            
            <View style={styles.journeyLine}>
                <View style={styles.dot}></View>
                <View style={styles.line}></View>
                <Text style={styles.duration}>{formatDuration(item.dureeVoyage)}</Text>
                <View style={styles.line}></View>
                <View style={styles.dot}></View>
            </View>
            
            <View style={styles.cardFooter}>
                <Text style={styles.availableSeats}>
                    {item.nbrPlaceRestante} places disponibles
                </Text>
                <TouchableOpacity 
                    style={styles.reserveButton} 
                    onPress={() => reserver(item)}
                >
                    <Text style={styles.reserveButtonText}>Réserver</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={retour}>
                    <Image
                        source={require('./images/Expand_left_light.png')}
                        style={styles.image_retour}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Voyages</Text>
                <TouchableOpacity 
                    style={styles.refreshButton} 
                    onPress={() => fetchVoyages(0, 20)}
                >
                    <Text style={styles.refreshText}>↻</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Filters */}
                <View style={styles.filtersContainer}>
                    <Text style={styles.filterLabel}>Filtrer</Text>
                    <View style={styles.filtersRow}>
                        {filters.map((filter) => (
                            <FilterButton
                                key={filter}
                                title={filter}
                                isSelected={selectedFilter === filter}
                            />
                        ))}
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>
                        {filteredResults.length} voyage(s) trouvé(s) sur {pagination.totalElements} total
                    </Text>
                </View>

                {/* Loading indicator */}
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#3B82F6" />
                        <Text style={styles.loadingText}>Chargement des voyages...</Text>
                    </View>
                ) : (
                    /* Results list */
                    <View style={styles.resultsList}>
                        {filteredResults.length > 0 ? (
                            filteredResults.map((item) => (
                                <ResultCard key={item.idVoyage} item={item} />
                            ))
                        ) : (
                            <View style={styles.noResultsContainer}>
                                <Text style={styles.noResultsText}>
                                    Aucun voyage trouvé pour ce filtre
                                </Text>
                                <TouchableOpacity 
                                    style={styles.resetFilterButton}
                                    onPress={() => setSelectedFilter('Tous')}
                                >
                                    <Text style={styles.resetFilterText}>Voir tous les voyages</Text>
                                </TouchableOpacity>
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
        backgroundColor: '#3B82F6',
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
        color: '#3B82F6',
        fontSize: 25,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
    },
    filtersContainer: {
        padding: 20,
        paddingBottom: 15,
    },
    filterLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        color: '#000000',
    },
    filtersRow: {
        flexDirection: 'row',
    },
    filterButton: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: '#e0e0e0',
    },
    filterButtonSelected: {
        backgroundColor: '#3B82F6',
    },
    filterButtonText: {
        color: '#000000',
        fontSize: 14,
        fontWeight: '500',
    },
    filterButtonTextSelected: {
        color: 'white',
        fontWeight : '600',
    },
    statsContainer: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    statsText: {
        fontSize: 14,
        color: '#000000',
        fontStyle: 'italic',
        fontWeight : '600',
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
        color: '#000000',
        fontWeight : '600',
    },
    noResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    noResultsText: {
        fontSize: 16,
        color: '#000000',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight : '600',
    },
    resetFilterButton: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 6,
    },
    resetFilterText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    resultsList: {
        padding: 20,
    },
    resultCard: {
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
    companyInfo: {
        flexDirection: 'row',
        flex: 1,
    },
    companyInitials: {
        width: 45,
        height: 45,
        borderRadius: 8,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    initialsText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    companyDetails: {
        flex: 1,
    },
    companyName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
        color: '#333',
    },
    fromLocation: {
        fontSize: 13,
        color: '#000000',
        marginBottom: 8,
        fontWeight : '600',
    },
    typeTag: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#E8F5E8',
        alignSelf: 'flex-start',
    },
    vipTag: {
        backgroundColor: '#FFF3E0',
    },
    typeText: {
        fontSize: 11,
        color: '#4CAF50',
        fontWeight: '600',
    },
    vipText: {
        color: '#FF9800',
    },
    priceSection: {
        alignItems: 'flex-end',
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3B82F6',
        marginBottom: 3,
    },
    perPerson: {
        fontSize: 11,
        color: '#000000',
        marginBottom: 10,
        fontWeight : '600',
    },
    toLocation: {
        fontSize: 13,
        color: '#000000',
        fontWeight : '600',
    },
    journeyLine: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        paddingHorizontal: 5,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF9800',
    },
    line: {
        flex: 1,
        height: 2,
        backgroundColor: '#FF9800',
        marginHorizontal: 5,
    },
    duration: {
        backgroundColor: 'white',
        paddingHorizontal: 8,
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    availableSeats: {
        fontSize: 15,
        color: '#000000',
        fontWeight : '600',
    },
    reserveButton: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 6,
    },
    reserveButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default SearchResultsPage;