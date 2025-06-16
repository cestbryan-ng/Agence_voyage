import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

const App11 = ({ navigation }) => {
  function retour() {
        setTravelerName('');
        setGender('');
        setAge('');
        setLuggage('');
        navigation.navigate('App10');
  }

  const [travelerName, setTravelerName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [luggage, setLuggage] = useState('1');
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  const genderOptions = ['Male', 'Female'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <ScrollView style={styles.mainContent}>
        {/* Left Panel - Traveler Information */}
        <View style={styles.leftPanel}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={{retour}}>
              <Icon name="arrow-back" size={24} color="#28068E" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Information du voyageur</Text>
          </View>

          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            {/* Seat Info */}
            <View style={styles.seatInfo}>
              <Icon name="airline-seat-recline-normal" size={20} color="#28068E" />
              <Text style={styles.seatText}>Place 8</Text>
            </View>

            {/* Traveler Name */}
            <View style={styles.inputGroup}>
              <View style={styles.inputHeader}>
                <Icon name="person" size={20} color="#666" />
                <Text style={styles.inputLabel}>Nom complet</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={travelerName}
                onChangeText={setTravelerName}
                placeholder="Entrer votre nom complet"
              />
            </View>

            {/* Gender and Age Row */}
            <View style={styles.rowContainer}>
              {/* Gender */}
              <View style={styles.halfInputGroup}>
                <View style={styles.inputHeader}>
                  <Icon name="wc" size={20} color="#666" />
                  <Text style={styles.inputLabel}>Genre</Text>
                </View>
                <TouchableOpacity 
                  style={styles.dropdownInput}
                  onPress={() => setShowGenderDropdown(!showGenderDropdown)}
                >
                  <Text style={styles.dropdownText}>{gender}</Text>
                  <Icon name="keyboard-arrow-down" size={20} color="#666" />
                </TouchableOpacity>
                
                {showGenderDropdown && (
                  <View style={styles.dropdownMenu}>
                    {genderOptions.map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={styles.dropdownOption}
                        onPress={() => {
                          setGender(option);
                          setShowGenderDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownOptionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Age */}
              <View style={styles.halfInputGroup}>
                <View style={styles.inputHeader}>
                  <Icon name="cake" size={20} color="#666" />
                  <Text style={styles.inputLabel}>Age</Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  value={age}
                  onChangeText={setAge}
                  placeholder="Age"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Luggage and ID Row */}
            <View style={styles.rowContainer}>
              {/* Luggage */}
              <View style={styles.halfInputGroup}>
                <View style={styles.inputHeader}>
                  <FontAwesome name="suitcase" size={18} color="#666" />
                  <Text style={styles.inputLabel}>Bagage</Text>
                </View>
                <View style={styles.luggageContainer}>
                  <TouchableOpacity 
                    style={styles.luggageButton}
                    onPress={() => setLuggage(Math.max(0, parseInt(luggage) - 1).toString())}
                  >
                    <Text style={styles.luggageButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.luggageValue}>{luggage}</Text>
                  <TouchableOpacity 
                    style={styles.luggageButton}
                    onPress={() => setLuggage((parseInt(luggage) + 1).toString())}
                  >
                    <Text style={styles.luggageButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.continueButton}>
              <Text style={styles.continueButtonText}>Continuer</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Right Panel - Ticket Preview */}
        <View style={styles.rightPanel}>
          <View style={styles.ticketHeader}>
            <Text style={styles.ticketTitle}>Vue du ticket</Text>
          </View>

          <View style={styles.ticketContainer}>
            {/* Passenger Info */}
            <View style={styles.passengerSection}>
              <View style={styles.passengerHeader}>
                <View style={styles.passengerIcon}>
                  <Icon name="person" size={24} color="white" />
                </View>
                <View style={styles.passengerInfo}>
                  <Text style={styles.passengerName}>MBALLA JEAN</Text>
                  <Text style={styles.passengerDetails}>Masculin, 30 ans</Text>
                </View>
                <View style={styles.idContainer}>
                  <Icon name="credit-card" size={16} color="#666" />
                  <Text style={styles.idText}>1007987778</Text>
                </View>
              </View>

              <View style={styles.seatLuggageRow}>
                <View style={styles.seatLuggageItem}>
                  <Icon name="airline-seat-recline-normal" size={16} color="#28068E" />
                  <Text style={styles.seatLuggageText}>Place: 8</Text>
                </View>
                <View style={styles.seatLuggageItem}>
                  <FontAwesome name="suitcase" size={14} color="#28068E" />
                  <Text style={styles.seatLuggageText}>Bagage: 1</Text>
                </View>
              </View>
            </View>

            {/* Trip Details */}
            <View style={styles.tripSection}>
              <Text style={styles.tripTitle}>Détail du voyage</Text>
              
              <View style={styles.tripDetailsGrid}>
                {/* Bus */}
                <View style={styles.tripDetailItem}>
                  <Icon name="directions-bus" size={16} color="#28068E" />
                  <Text style={styles.tripDetailLabel}>Bus LT98918hp</Text>
                </View>

                {/* Date */}
                <View style={styles.tripDetailItem}>
                  <Icon name="event" size={16} color="#28068E" />
                  <Text style={styles.tripDetailLabel}>Date: Février 10, 2025</Text>
                </View>

                {/* From */}
                <View style={styles.tripDetailItem}>
                  <Icon name="location-on" size={16} color="#28068E" />
                  <Text style={styles.tripDetailLabel}>De: Maroua</Text>
                </View>

                {/* To */}
                <View style={styles.tripDetailItem}>
                  <Icon name="place" size={16} color="#28068E" />
                  <Text style={styles.tripDetailLabel}>A: Bertoua</Text>
                </View>

                {/* Departure */}
                <View style={styles.tripDetailItem}>
                  <Icon name="access-time" size={16} color="#28068E" />
                  <Text style={styles.tripDetailLabel}>Départ: 03:45 PM</Text>
                </View>

                {/* Price */}
                <View style={styles.tripDetailItem}>
                  <Text style={styles.priceIcon}>$</Text>
                  <Text style={styles.tripDetailLabel}>Prix: 15000 FCFA</Text>
                </View>
              </View>
            </View>
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
  mainContent: {
    flex: 1,
    padding: 20,
  },
  leftPanel: {
    flex: 0.45,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rightPanel: {
    flex: 0.55,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#28068E',
  },
  formContainer: {
    flex: 1,
  },
  seatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f7ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  seatText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#28068E',
    marginLeft: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontWeight: '500',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    height: 48,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  halfInputGroup: {
    flex: 0.48,
    position: 'relative',
  },
  dropdownInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 1000,
  },
  dropdownOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#333',
  },
  luggageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    paddingVertical: 4,
    paddingHorizontal: 8,
    height: 50,
  },
  luggageButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#28068E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  luggageButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  luggageValue: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  continueButton: {
    backgroundColor: '#28068E',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  ticketContainer: {
    flex: 1,
  },
  passengerSection: {
    marginBottom: 24,
  },
  passengerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  passengerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#28068E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  passengerDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  idText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  seatLuggageRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  seatLuggageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  seatLuggageText: {
    fontSize: 14,
    color: '#6B46C1',
    marginLeft: 6,
    fontWeight: '500',
  },
  tripSection: {
    flex: 1,
  },
  tripTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  tripDetailsGrid: {
    flex: 1,
  },
  tripDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  tripDetailLabel: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    fontWeight: '500',
  },
  priceIcon: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
    backgroundColor: '#f0fdf4',
    width: 20,
    height: 20,
    textAlign: 'center',
    borderRadius: 10,
  },
});

export default App11;