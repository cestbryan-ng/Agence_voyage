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
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const App9 = ({ navigation, route }) => {
  function retour() {
    navigation.navigate('App8', {
      token: token,
      userData: userData,
      nom_envoye: nom_envoye
    });
  }

  function rechercher() {
    navigation.navigate('App13', {
      token: token,
      userData: userData,
      nom_envoye: nom_envoye,
      lieuDepart : departure,
      lieuArrive : destination
    }); 
  }

  const { nom_envoye, userData, token } = route.params ;
  const [selectedTab, setSelectedTab] = useState('Voyage');
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#28068E" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={(retour)}>
          <Icon name="chevron-left" size={40} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reservation</Text>
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
        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Departure */}
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <View style={styles.redDot} />
              <Text style={styles.inputLabel}>Départ</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Ville de depart"
                value={departure}
                onChangeText={setDeparture}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Destination */}
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <View style={styles.redDot} />
              <Text style={styles.inputLabel}>Destination</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Ville d'arrivee"
                value={destination}
                onChangeText={setDestination}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Search Button */}
          <TouchableOpacity style={styles.searchButton} onPress={(rechercher)}>
            <Icon name="search" size={20} color="white" style={styles.searchIcon} />
            <Text style={styles.searchButtonText}>Rechercher des voyages</Text>
          </TouchableOpacity>
        </View>

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
    backgroundColor : '#ffffff58',
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
  calendarIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  passengersIcon: {
    fontSize: 16,
    marginRight: 8,
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
  inputContainerfocus: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
  },    
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  swapButton: {
    padding: 4,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  halfInputGroup: {
    height: 45,
    flex: 0.48,
  },
  dateContainer: {
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
  quickAccessIcon: {
    fontSize: 18,
    marginRight: 8,
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
});

export default App9;