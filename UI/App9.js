import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  ScrollView,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const { width } = Dimensions.get('window');

// Composant pour l'onglet "Voyage"
const VoyageForm = ({ navigation }) => {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState('1 passager');

  const handleSearch = () => {
    if (departure && destination && date) {
      navigation.navigate('TripSearchResults', { departure, destination, date, passengers });
    } else {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
    }
  };

  return (
    <View style={styles.formSection}>
      <View style={styles.inputGroup}>
        <View style={styles.labelContainer}>
          <View style={styles.redDot} />
          <Text style={styles.inputLabel}>Départ</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ville de départ"
            value={departure}
            onChangeText={setDeparture}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <View style={styles.labelContainer}>
          <View style={styles.redDot} />
          <Text style={styles.inputLabel}>Destination</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ville d'arrivée"
            value={destination}
            onChangeText={setDestination}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.halfInputGroup}>
          <View style={styles.labelContainer}>
            <View style={styles.redDot} />
            <Text style={styles.inputLabel}>Date départ</Text>
          </View>
          <TouchableOpacity style={styles.dateContainer}>
            <TextInput
              style={styles.dateInput}
              placeholder="jj/mm/aaaa"
              value={date}
              onChangeText={setDate}
              placeholderTextColor="#999"
            />
            <Icon name="event" size={20} color="#28068E" />
          </TouchableOpacity>
        </View>

        <View style={styles.halfInputGroup}>
          <View style={styles.labelContainer}>
            <View style={styles.redDot} />
            <Text style={styles.inputLabel}>Passagers</Text>
          </View>
          <TouchableOpacity style={styles.passengersContainer}>
            <Text style={styles.passengersText}>{passengers}</Text>
            <Icon name="keyboard-arrow-down" size={20} color="#28068E" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Icon name="search" size={20} color="white" style={styles.searchIcon} />
        <Text style={styles.searchButtonText}>Rechercher des voyages</Text>
      </TouchableOpacity>
    </View>
  );
};

// Composant pour l'onglet "Location Bus"
const BusRentalForm = ({ navigation }) => {
  const [rentalType, setRentalType] = useState('with_driver');
  const [capacity, setCapacity] = useState('');
  const [busType, setBusType] = useState('');
  const [duration, setDuration] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [itinerary, setItinerary] = useState('');
  const [showCapacityModal, setShowCapacityModal] = useState(false);
  const [showBusTypeModal, setShowBusTypeModal] = useState(false);
  const [showDurationModal, setShowDurationModal] = useState(false);

  const capacityOptions = ['15-20 places', '20-30 places', '30-40 places', '40+ places'];
  const busTypeOptions = ['Standard', 'Luxury', 'VIP'];
  const durationOptions = ['1 jour', '2-3 jours', '1 semaine', '+1 semaine'];

  const handleSearch = async () => {
    if (pickupLocation && startDate && endDate) {
      try {
        const response = await axios.post('http://agence-voyage.ddns.net/api/bus/rental/search', {
          rentalType,
          capacity,
          busType,
          duration,
          pickupLocation,
          startDate,
          endDate,
          itinerary,
        });
        console.log('Résultats de la recherche de bus:', response.data);
        Alert.alert('Succès', 'Recherche effectuée avec succès!');
      } catch (error) {
        console.error('Erreur lors de la recherche de bus:', error);
        Alert.alert('Erreur', 'Erreur lors de la recherche de bus.');
      }
    } else {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
    }
  };

  const SelectModal = ({ visible, options, onSelect, onClose }) => (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sélectionner une option</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={options}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => onSelect(item)}
              >
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={styles.formSection} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Type de location</Text>
      <View style={styles.rentalTypeContainer}>
        <TouchableOpacity
          style={[styles.rentalTypeButton, rentalType === 'with_driver' && styles.selectedButton]}
          onPress={() => setRentalType('with_driver')}
        >
          <Text style={[styles.rentalTypeText, rentalType === 'with_driver' && styles.selectedButtonText]}>
            Avec chauffeur
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.rentalTypeButton, rentalType === 'without_driver' && styles.selectedButton]}
          onPress={() => setRentalType('without_driver')}
        >
          <Text style={[styles.rentalTypeText, rentalType === 'without_driver' && styles.selectedButtonText]}>
            Sans chauffeur
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <View style={styles.labelContainer}>
          <View style={styles.redDot} />
          <Text style={styles.inputLabel}>Capacité</Text>
        </View>
        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setShowCapacityModal(true)}
        >
          <Text style={[styles.textInput, !capacity && styles.placeholderText]}>
            {capacity || 'Sélectionner la capacité'}
          </Text>
          <Icon name="arrow-drop-down" size={24} color="#28068E" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <View style={styles.labelContainer}>
          <View style={styles.redDot} />
          <Text style={styles.inputLabel}>Type de bus</Text>
        </View>
        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setShowBusTypeModal(true)}
        >
          <Text style={[styles.textInput, !busType && styles.placeholderText]}>
            {busType || 'Sélectionner le type'}
          </Text>
          <Icon name="arrow-drop-down" size={24} color="#28068E" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <View style={styles.labelContainer}>
          <View style={styles.redDot} />
          <Text style={styles.inputLabel}>Durée de location</Text>
        </View>
        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setShowDurationModal(true)}
        >
          <Text style={[styles.textInput, !duration && styles.placeholderText]}>
            {duration || 'Sélectionner la durée'}
          </Text>
          <Icon name="arrow-drop-down" size={24} color="#28068E" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <View style={styles.labelContainer}>
          <View style={styles.redDot} />
          <Text style={styles.inputLabel}>Lieu de prise en charge</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Adresse complète ou ville"
            value={pickupLocation}
            onChangeText={setPickupLocation}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.halfInputGroup}>
          <View style={styles.labelContainer}>
            <View style={styles.redDot} />
            <Text style={styles.inputLabel}>Date début</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="jj/mm/aaaa"
              value={startDate}
              onChangeText={setStartDate}
              placeholderTextColor="#999"
            />
            <Icon name="event" size={20} color="#28068E" />
          </View>
        </View>
        <View style={styles.halfInputGroup}>
          <View style={styles.labelContainer}>
            <View style={styles.redDot} />
            <Text style={styles.inputLabel}>Date fin</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="jj/mm/aaaa"
              value={endDate}
              onChangeText={setEndDate}
              placeholderTextColor="#999"
            />
            <Icon name="event" size={20} color="#28068E" />
          </View>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Itinéraire prévu (optionnel)</Text>
        <View style={[styles.inputContainer, styles.textAreaContainer]}>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Décrivez votre itinéraire"
            value={itinerary}
            onChangeText={setItinerary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Icon name="search" size={20} color="white" style={styles.searchIcon} />
        <Text style={styles.searchButtonText}>Rechercher des bus disponibles</Text>
      </TouchableOpacity>

      {/* Modals */}
      <SelectModal
        visible={showCapacityModal}
        options={capacityOptions}
        onSelect={(item) => {
          setCapacity(item);
          setShowCapacityModal(false);
        }}
        onClose={() => setShowCapacityModal(false)}
      />

      <SelectModal
        visible={showBusTypeModal}
        options={busTypeOptions}
        onSelect={(item) => {
          setBusType(item);
          setShowBusTypeModal(false);
        }}
        onClose={() => setShowBusTypeModal(false)}
      />

      <SelectModal
        visible={showDurationModal}
        options={durationOptions}
        onSelect={(item) => {
          setDuration(item);
          setShowDurationModal(false);
        }}
        onClose={() => setShowDurationModal(false)}
      />
    </ScrollView>
  );
};

// Composant pour l'onglet "Chauffeur"
const DriverReservationForm = ({ navigation }) => {
  const [serviceType, setServiceType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [requirements, setRequirements] = useState('');

  const handleReserve = async () => {
    if (serviceType && date && time && location && duration) {
      try {
        const response = await axios.post('http://agence-voyage.ddns.net/api/driver/reserve', {
          serviceType,
          date,
          time,
          location,
          duration,
          requirements,
        });
        console.log('Réservation de chauffeur:', response.data);
        Alert.alert('Succès', 'Réservation effectuée avec succès!');
      } catch (error) {
        console.error('Erreur lors de la réservation de chauffeur:', error);
        Alert.alert('Erreur', 'Erreur lors de la réservation de chauffeur.');
      }
    } else {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
    }
  };

  return (
    <ScrollView style={styles.formSection} showsVerticalScrollIndicator={false}>
      <View style={styles.inputGroup}>
        <View style={styles.labelContainer}>
          <View style={styles.redDot} />
          <Text style={styles.inputLabel}>Type de service</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Pour un voyage, Pour un événement"
            value={serviceType}
            onChangeText={setServiceType}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.halfInputGroup}>
          <View style={styles.labelContainer}>
            <View style={styles.redDot} />
            <Text style={styles.inputLabel}>Date</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="jj/mm/aaaa"
              value={date}
              onChangeText={setDate}
              placeholderTextColor="#999"
            />
            <Icon name="event" size={20} color="#28068E" />
          </View>
        </View>
        <View style={styles.halfInputGroup}>
          <View style={styles.labelContainer}>
            <View style={styles.redDot} />
            <Text style={styles.inputLabel}>Heure</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="hh:mm"
              value={time}
              onChangeText={setTime}
              placeholderTextColor="#999"
            />
            <Icon name="access-time" size={20} color="#28068E" />
          </View>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <View style={styles.labelContainer}>
          <View style={styles.redDot} />
          <Text style={styles.inputLabel}>Lieu</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Adresse ou ville"
            value={location}
            onChangeText={setLocation}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <View style={styles.labelContainer}>
          <View style={styles.redDot} />
          <Text style={styles.inputLabel}>Durée</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., 2 heures, 1 jour"
            value={duration}
            onChangeText={setDuration}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Exigences particulières (optionnel)</Text>
        <View style={[styles.inputContainer, styles.textAreaContainer]}>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Décrivez vos besoins spécifiques"
            value={requirements}
            onChangeText={setRequirements}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.searchButton} onPress={handleReserve}>
        <Icon name="check" size={20} color="white" style={styles.searchIcon} />
        <Text style={styles.searchButtonText}>Réserver un chauffeur</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Composant principal App9
const App9 = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('Voyage');

  function retour() {
    navigation.navigate('App8');
  }

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'Voyage':
        return <VoyageForm navigation={navigation} />;
      case 'Location Bus':
        return <BusRentalForm navigation={navigation} />;
      case 'Chauffeur':
        return <DriverReservationForm navigation={navigation} />;
      default:
        return <VoyageForm navigation={navigation} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6B46C1" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={retour}>
          <Icon name="chevron-left" size={40} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Réservation</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tab Selection */}
      <View style={styles.tabContainer}>
        <View style={styles.tabWrapper}>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'Voyage' && styles.activeTab]}
            onPress={() => setSelectedTab('Voyage')}
          >
            <Text style={styles.tabIcon}>🚌</Text>
            <Text style={[styles.tabText, selectedTab === 'Voyage' && styles.activeTabText]}>
              Voyage
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'Location Bus' && styles.activeTab]}
            onPress={() => setSelectedTab('Location Bus')}
          >
            <Text style={styles.tabIcon}>🚐</Text>
            <Text style={[styles.tabText, selectedTab === 'Location Bus' && styles.activeTabText]}>
              Location Bus
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'Chauffeur' && styles.activeTab]}
            onPress={() => setSelectedTab('Chauffeur')}
          >
            <Text style={styles.tabIcon}>👤</Text>
            <Text style={[styles.tabText, selectedTab === 'Chauffeur' && styles.activeTabText]}>
              Chauffeur
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Dynamic Tab Content */}
        {renderTabContent()}

        {/* Quick Access Section */}
        <View style={styles.quickAccessSection}>
          <View style={styles.quickAccessHeader}>
            <Text style={styles.quickAccessTitle}>Accès rapide</Text>
          </View>

          <View style={styles.quickAccessGrid}>
            {/* Real Time Tracking */}
            <TouchableOpacity style={styles.quickAccessCard}>
              <View style={styles.cardIcon}>
                <Text style={styles.cardIconText}>🔴</Text>
              </View>
              <Text style={styles.cardTitle}>Suivi temps réel</Text>
              <Text style={styles.cardSubtitle}>Position des agences</Text>
            </TouchableOpacity>

            {/* Support */}
            <TouchableOpacity style={styles.quickAccessCard}>
              <View style={styles.cardIcon}>
                <Text style={styles.cardIconText}>💬</Text>
              </View>
              <Text style={styles.cardTitle}>Support</Text>
              <Text style={styles.cardSubtitle}>Aide client</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#28068E',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#ffffff58',
    width: 40,
    height: 40,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: '600',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  tabContainer: {
    backgroundColor: '#28068E',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tabWrapper: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
  },
  activeTabText: {
    color: '#333',
  },
  content: {
    flex: 1,
  },
  formSection: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  inputContainer: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
  },
  textAreaContainer: {
    height: 100,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: '100%',
    textAlignVertical: 'top',
  },
  placeholderText: {
    color: '#999',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  halfInputGroup: {
    flex: 0.48,
  },
  dateContainer: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  passengersContainer: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
  },
  passengersText: {
    fontSize: 16,
    color: '#333',
  },
  rentalTypeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  rentalTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  selectedButton: {
    backgroundColor: '#28068E',
    borderColor: '#28068E',
  },
  rentalTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedButtonText: {
    color: 'white',
  },
  searchButton: {
    backgroundColor: '#28068E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  quickAccessSection: {
    margin: 20,
    marginTop: 0,
  },
  quickAccessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickAccessTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAccessCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIconText: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: width * 0.8,
    maxHeight: 400,
    paddingVertical: 20,
  },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
    },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
});
export default App9;