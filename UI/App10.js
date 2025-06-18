import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

const App10 = ({ navigation, route }) => {
  function retour() {
    navigation.navigate('App8');
  }

  const { voyage, token, userData, nom_envoye } = route.params;
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showSeatSelection, setShowSeatSelection] = useState(false);

  // Génération des sièges
  const generateSeats = () => {
    const seats = [];
    // Driver seat
    seats.push({ id: 'driver', type: 'driver', available: false });
    
    // Regular seats 
    for (let i = 1; i <= voyage.nbrPlaceRestante; i++) {
      const isReserved = [].includes(i); // Quelques sièges réservés
      const isSelected = selectedSeats.includes(i);
      seats.push({
        id: i,
        type: isReserved ? 'reserved' : isSelected ? 'selected' : 'available',
        available: !isReserved,
      });
    }
    return seats;
  };

  const handleSeatPress = (seatId) => {
    if (seatId === 'driver') return;
    
    const seat = generateSeats().find(s => s.id === seatId);
    if (!seat.available) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const getSeatStyle = (seat) => {
    switch (seat.type) {
      case 'driver':
        return styles.driverSeat;
      case 'reserved':
        return styles.reservedSeat;
      case 'selected':
        return styles.selectedSeat;
      default:
        return styles.availableSeat;
    }
  };

  const renderSeat = (seat, index) => {
    return (
      <TouchableOpacity
        key={seat.id}
        style={[styles.seat, getSeatStyle(seat)]}
        onPress={() => handleSeatPress(seat.id)}
        disabled={!seat.available && seat.type !== 'selected'}
      >
        <Text style={[
          styles.seatText,
          seat.type === 'driver' && styles.driverText,
          seat.type === 'reserved' && styles.reservedText,
          seat.type === 'selected' && styles.selectedText,
        ]}>
          {seat.id === 'driver' ? 'Driver' : seat.id}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSeatMap = () => {
    const seats = generateSeats();
    const seatRows = [];
    
    // Driver seat row
    seatRows.push(
      <View key="driver-row" style={styles.driverRow}>
        {renderSeat(seats[0])}
      </View>
    );

    // Regular seat rows (4 seats per row)
    for (let i = 1; i < seats.length; i += 4) {
      const rowSeats = seats.slice(i, i + 4);
      seatRows.push(
        <View key={`row-${i}`} style={styles.seatRow}>
          {rowSeats.map((seat, index) => renderSeat(seat, index))}
        </View>
      );
    }

    return seatRows;
  };

  return (
    <View style={styles.container}>      
      {/* Main Content */}
      <ScrollView style={styles.mainContent}>
        {/* Left Side - Booking Details */}
        <View style={styles.leftPanel}>
            <View style = {{flexDirection : 'row'}}>
              <Text style={styles.pageTitle}>Details du voyage</Text>
              <TouchableOpacity style={styles.closeButton} onPress={(retour)}>
                <Icon name="close" size={24} color="#EF4444" />
              </TouchableOpacity>
            </View>
          
          <View style={styles.detailsContainer}>
            {/* Travel Agency */}
            <View style={styles.detailRow}>
              <Icon name="home" size={20} color="#28068E" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Agence de voyage</Text>
                <Text style={styles.detailValue}>{voyage.nomAgence || 'Non défini'}</Text>
              </View>
            </View>

            {/* Departure Location */}
            <View style={styles.detailRow}>
              <Icon name="location-on" size={20} color="#28068E" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Lieu de départ</Text>
                <Text style={styles.detailValue}>{voyage.lieuDepart || 'Non défini'}</Text>
              </View>
            </View>

            {/* Arrival Location */}
            <View style={styles.detailRow}>
              <Icon name="place" size={20} color="#28068E" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Lieu d'arrivé</Text>
                <Text style={styles.detailValue}>{voyage.lieuArrive || 'Non défini'}</Text>
              </View>
            </View>

            {/* Unit Price */}
            <View style={styles.detailRow}>
              <Icon name="credit-card" size={20} color="#28068E" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Unité</Text>
                <Text style={styles.detailValue}>{voyage.prix || 'Erreur'} FCFA</Text>
              </View>
            </View>

            {/* Number of places */}
            <View style={styles.detailRow}>
              <Icon name="airline-seat-recline-normal" size={20} color="#28068E" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Nombre de place reservée</Text>
                <Text style={styles.detailValue}>{selectedSeats.length}</Text>
              </View>
            </View>

            {/* Total Price */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Prix Total</Text>
              <Text style={styles.totalValue}>{selectedSeats.length * voyage.prix} FCFA</Text>
            </View>

            {/* Selected Seats */}
            <View style={styles.detailRow}>
              <Icon name="event-seat" size={20} color="#28068E" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Place(s) selectionnée(s)</Text>
                <Text style={styles.detailValue}>
                  {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.continueButton}>
            <Text style={styles.continueButtonText}>Continuer</Text>
          </TouchableOpacity>
        </View>

        {/* Right Side - Seat Selection */}
        <View style={styles.rightPanel}>
          <View style={styles.seatSelectionHeader}>
            <Text style={styles.seatSelectionTitle}>Selection des places</Text>
          </View>
          
          <Text style={styles.seatSelectionSubtitle}>
            S'il vous plaît choissisez vos places pour le voyage
          </Text>

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, styles.availableSeat]} />
              <Text style={styles.legendText}>Disponible</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, styles.selectedSeat]} />
              <Text style={styles.legendText}>Prise par vous</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, styles.reservedSeat]} />
              <Text style={styles.legendText}>Reservée</Text>
            </View>
          </View>

          {/* Seat Map */}
          <ScrollView style={styles.seatMapContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.seatMap}>
              {renderSeatMap()}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
    padding : 20,
  },
  leftPanel: {
    width: 360,
    alignSelf: 'center',
    flex: 0.4,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  rightPanel: {
    width: 360,
    flex: 0.6,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#28068E',
    paddingRight : 130,
    marginBottom: 20,
  },
  detailsContainer: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    marginVertical: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  continueButton: {
    backgroundColor: '#28068E',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  seatSelectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  seatSelectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  seatSelectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  seatMapContainer: {
    flex: 1,
  },
  seatMap: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    justifyContent: 'center',
  },
  seatNumbers: {
    flexDirection: 'row',
    marginLeft: 20,
  },
  seatNumber: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginHorizontal: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  seatRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  seat: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    borderWidth: 1,
    width: 40,
    height: 40,
  },
  seatText: {
    fontSize: 10,
    fontWeight: '500',
    fontSize: 15,
  },
  availableSeat: {
    backgroundColor: 'white',
    borderColor: '#d1d5db',
  },
  selectedSeat: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  selectedText: {
    color: 'white',
  },
  reservedSeat: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  reservedText: {
    color: 'white',
    fontSize: 15,
  },
  driverSeat: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
    width: 70,
    height: 40,
  },
  driverText: {
    color: 'white',
    fontSize: 15,
  },
  rowLabel: {
    fontSize: 10,
    color: '#666',
    marginLeft: 12,
  },
  rowNumber: {
    fontSize: 10,
    color: '#666',
    marginLeft: 12,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});

export default App10;