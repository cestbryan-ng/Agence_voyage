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
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

const App10 = ({ navigation, route }) => {
  const retour = () => {
      navigation.navigate('App8', {
        nom_envoye: nom_envoye,
        userData: userData,
        token: token
      });
  }

  const { voyage, token, userData, nom_envoye } = route.params;
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [nombreBagages, setNombreBagages] = useState(0);
  
  // États pour la réservation
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [passagers, setPassagers] = useState([]);
  const [reservationLoading, setReservationLoading] = useState(false);
  
  // États pour les actions post-réservation
  const [showPostReservationModal, setShowPostReservationModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  
  // États pour le paiement
  const [mobilePhone, setMobilePhone] = useState('');
  const [mobilePhoneName, setMobilePhoneName] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Fonction pour augmenter le nombre de bagages
  const augmenterBagages = () => {
    setNombreBagages(nombreBagages + 1);
  };

  // Fonction pour diminuer le nombre de bagages
  const diminuerBagages = () => {
    if (nombreBagages > 0) {
      setNombreBagages(nombreBagages - 1);
    }
  };

  // Fonction pour initier la réservation
  const initierReservation = () => {
    if (selectedSeats.length === 0) {
      Alert.alert('Erreur', 'Veuillez sélectionner au moins une place');
      return;
    }

    // Initialiser les passagers avec les places sélectionnées
    const nouveauxPassagers = selectedSeats.map((place, index) => ({
      numeroPieceIdentific: '',
      nom: '',
      genre: 'M',
      age: '',
      nbrBaggage: nombreBagages,
      placeChoisis: place
    }));

    setPassagers(nouveauxPassagers);
    setShowReservationModal(true);
  };

  // Fonction pour mettre à jour les informations d'un passager
  const updatePassager = (index, field, value) => {
    const nouveauxPassagers = [...passagers];
    nouveauxPassagers[index][field] = value;
    setPassagers(nouveauxPassagers);
  };

  // Fonction pour valider les données des passagers
  const validerPassagers = () => {
    for (let i = 0; i < passagers.length; i++) {
      const passager = passagers[i];
      if (!passager.numeroPieceIdentific.trim()) {
        Alert.alert('Erreur', `Veuillez saisir le numéro de pièce d'identité du passager ${i + 1}`);
        return false;
      }
      if (!passager.nom.trim()) {
        Alert.alert('Erreur', `Veuillez saisir le nom du passager ${i + 1}`);
        return false;
      }
      if (!passager.age || isNaN(passager.age) || passager.age < 1) {
        Alert.alert('Erreur', `Veuillez saisir un âge valide pour le passager ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  // Fonction pour effectuer la réservation
  const effectuerReservation = async () => {
    if (!validerPassagers()) {
      return;
    }

    try {
      setReservationLoading(true);

      const reservationData = {
        nbrPassager: selectedSeats.length,
        montantPaye: 0, // Pas de paiement initial
        idUser: userData?.userId || '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        idVoyage: voyage.idVoyage,
        passagerDTO: passagers.map(passager => ({
          ...passager,
          age: parseInt(passager.age),
          nbrBaggage: parseInt(passager.nbrBaggage) || 0,
          placeChoisis: parseInt(passager.placeChoisis)
        }))
      };

      const response = await fetch('http://agence-voyage.ddns.net/api/reservation/reserver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(reservationData)
      });

      if (response.ok) {
        const reservationResult = await response.json();
        
        // Stocker les informations de la réservation
        setCurrentReservation({
          ...reservationResult,
          prixTotal: selectedSeats.length * voyage.prix,
          agence: { longName: voyage.nomAgence },
          voyage: voyage
        });
        
        setShowReservationModal(false);
        setShowPostReservationModal(true);
      } else {
        const errorData = await response.text();
        throw new Error(`Erreur lors de la réservation: ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur réservation:', error);
      Alert.alert('Erreur', 'Erreur lors de la réservation. Veuillez réessayer.');
    } finally {
      setReservationLoading(false);
    }
  };

  // Fonction pour ouvrir le modal de paiement
  const ouvrirModalPaiement = () => {
    setShowPostReservationModal(false);
    setMobilePhone('');
    setMobilePhoneName('');
    setShowPaymentModal(true);
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
        amount: currentReservation.prixTotal,
        userId: userData?.userId || '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        reservationId: currentReservation.idReservation
      };

      const response = await fetch('http://agence-voyage.ddns.net/api/reservation/payer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      if (response.ok) {
        Alert.alert(
          'Succès', 
          'Paiement effectué avec succès !',
          [
            {
              text: 'OK',
              onPress: () => {
                setShowPaymentModal(false);
                navigation.navigate('App15', { // Aller vers les billets
                  nom_envoye: nom_envoye,
                  userData: userData,
                  token: token
                });
              }
            }
          ]
        );
      } else {
        throw new Error(`Erreur lors du paiement: ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur paiement:', error);
      Alert.alert('Erreur', 'Erreur lors du paiement. Veuillez réessayer.');
    } finally {
      setPaymentLoading(false);
    }
  };

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

            {/* Bagages Section */}
            <View style={styles.detailRow}>
              <Icon name="luggage" size={20} color="#28068E" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Nombre de bagages</Text>
                <View style={styles.bagageControls}>
                  <TouchableOpacity 
                    style={styles.bagageButton} 
                    onPress={diminuerBagages}
                    disabled={nombreBagages === 0}
                  >
                    <Icon name="remove" size={20} color={nombreBagages === 0 ? "#ccc" : "#28068E"} />
                  </TouchableOpacity>
                  <Text style={styles.bagageCount}>{nombreBagages}</Text>
                  <TouchableOpacity 
                    style={styles.bagageButton} 
                    onPress={augmenterBagages}
                  >
                    <Icon name="add" size={20} color="#28068E" />
                  </TouchableOpacity>
                </View>
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
                  {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Aucune'}
                </Text>
              </View>
            </View>

            {/* Bagages Summary */}
            {nombreBagages > 0 && (
              <View style={styles.detailRow}>
                <Icon name="work" size={20} color="#28068E" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Résumé bagages</Text>
                  <Text style={styles.detailValue}>
                    {nombreBagages} bagage{nombreBagages > 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.continueButton} onPress={initierReservation}>
            <Text style={styles.continueButtonText}>Réserver</Text>
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

      {/* Modal de réservation */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showReservationModal}
        onRequestClose={() => setShowReservationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Informations des passagers</Text>
              <TouchableOpacity onPress={() => setShowReservationModal(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {passagers.map((passager, index) => (
                <View key={index} style={styles.passagerForm}>
                  <Text style={styles.passagerTitle}>
                    Passager {index + 1} - Place {passager.placeChoisis}
                  </Text>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Numéro de pièce d'identité *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="CNI, Passeport, etc."
                      value={passager.numeroPieceIdentific}
                      onChangeText={(value) => updatePassager(index, 'numeroPieceIdentific', value)}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Nom complet *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Nom et prénom(s)"
                      value={passager.nom}
                      onChangeText={(value) => updatePassager(index, 'nom', value)}
                    />
                  </View>

                  <View style={styles.inputRow}>
                    <View style={styles.inputHalf}>
                      <Text style={styles.inputLabel}>Genre *</Text>
                      <View style={styles.genderContainer}>
                        <TouchableOpacity 
                          style={[styles.genderOption, passager.genre === 'M' && styles.genderOptionSelected]}
                          onPress={() => updatePassager(index, 'genre', 'M')}
                        >
                          <Text style={[styles.genderText, passager.genre === 'M' && styles.genderTextSelected]}>
                            Homme
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.genderOption, passager.genre === 'F' && styles.genderOptionSelected]}
                          onPress={() => updatePassager(index, 'genre', 'F')}
                        >
                          <Text style={[styles.genderText, passager.genre === 'F' && styles.genderTextSelected]}>
                            Femme
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.inputHalf}>
                      <Text style={styles.inputLabel}>Âge *</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Âge"
                        value={passager.age.toString()}
                        onChangeText={(value) => updatePassager(index, 'age', value)}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Nombre de bagages</Text>
                    <View style={styles.bagageControls}>
                      <TouchableOpacity 
                        style={styles.bagageButton} 
                        onPress={() => {
                          const newValue = Math.max(0, parseInt(passager.nbrBaggage) - 1);
                          updatePassager(index, 'nbrBaggage', newValue);
                        }}
                      >
                        <Icon name="remove" size={20} color="#28068E" />
                      </TouchableOpacity>
                      <Text style={styles.bagageCount}>{passager.nbrBaggage}</Text>
                      <TouchableOpacity 
                        style={styles.bagageButton} 
                        onPress={() => {
                          const newValue = parseInt(passager.nbrBaggage) + 1;
                          updatePassager(index, 'nbrBaggage', newValue);
                        }}
                      >
                        <Icon name="add" size={20} color="#28068E" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <View style={styles.reservationSummary}>
                <Text style={styles.summaryText}>
                  Total: {selectedSeats.length * voyage.prix} FCFA pour {selectedSeats.length} passager(s)
                </Text>
              </View>

              <View style={styles.modalActions}>                
                <TouchableOpacity 
                  style={[styles.confirmReservationButton, reservationLoading && styles.confirmButtonDisabled]} 
                  onPress={effectuerReservation}
                  disabled={reservationLoading}
                >
                  {reservationLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.confirmReservationButtonText}>Confirmer la réservation</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal post-réservation */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPostReservationModal}
        onRequestClose={() => setShowPostReservationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.postReservationModal}>
            <View style={styles.successHeader}>
              <Icon name="check-circle" size={60} color="#10B981" />
              <Text style={styles.successTitle}>Réservation réussie !</Text>
              <Text style={styles.successSubtitle}>
                Votre réservation a été enregistrée avec succès
              </Text>
            </View>

            {currentReservation && (
              <View style={styles.reservationSummary}>
                <Text style={styles.summaryTitle}>Résumé de la réservation</Text>
                <Text style={styles.summaryText}>
                  {currentReservation.agence?.longName} : De {currentReservation.voyage.lieuDepart} à {currentReservation.voyage.lieuArrive}
                </Text>
                <Text style={styles.summaryAmount}>
                  Montant: {currentReservation.prixTotal?.toLocaleString()} FCFA
                </Text>
                <Text style={styles.summaryPassengers}>
                  {selectedSeats.length} passager(s) - Places: {selectedSeats.join(', ')}
                </Text>
              </View>
            )}

            <Text style={styles.postReservationText}>
              Que souhaitez-vous faire maintenant ?
            </Text>

            <View style={styles.postReservationActions}>
              <TouchableOpacity 
                style={styles.payNowButton}
                onPress={ouvrirModalPaiement}
              >
                <Icon name="payment" size={24} color="white" />
                <Text style={styles.payNowButtonText}>Payer maintenant</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.payLaterButton}
                onPress={() => {
                  setShowPostReservationModal(false);
                  navigation.navigate('App14', {
                    nom_envoye: nom_envoye,
                    userData: userData,
                    token: token
                  });
                }}
              >
                <Icon name="schedule" size={24} color="#28068E" />
                <Text style={styles.payLaterButtonText}>Payer plus tard</Text>
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
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent2}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Paiement</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {currentReservation && (
              <View style={styles.reservationSummary}>
                <Text style={styles.summaryTitle}>Résumé du paiement</Text>
                <Text style={styles.summaryText}>
                  {currentReservation.agence?.longName} : De {currentReservation.voyage.lieuDepart} à {currentReservation.voyage.lieuArrive}
                </Text>
                <Text style={styles.summaryAmount}>
                  Montant à payer: {currentReservation.prixTotal?.toLocaleString()} FCFA
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
                Une demande de paiement sera envoyé sur ce numéro pour valider le paiement
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
  // Styles pour les bagages
  bagageControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  bagageButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  bagageCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 15,
    minWidth: 30,
    textAlign: 'center',
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
  // Styles pour le modal de réservation
  modalOverlay: {
    flex:1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '95%',
    maxHeight: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalContent2: {
    padding : 10,
    backgroundColor: 'white',
    borderRadius: 16,
    width: '95%',
    maxHeight: '90%',
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalScroll: {
    maxHeight: 400,
    padding: 20,
  },
  passagerForm: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  passagerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#28068E',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    width: '48%',
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
  genderContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  genderOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  genderOptionSelected: {
    backgroundColor: '#28068E',
  },
  genderText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  genderTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  modalFooter: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 20,
  },
  reservationSummary: {
    backgroundColor: '#e8f4fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#28068E',
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  cancelReservationButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelReservationButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmReservationButton: {
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
  confirmReservationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Styles pour le modal post-réservation
  postReservationModal: {
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
  successHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#10B981',
    marginTop: 10,
    marginBottom: 5,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  postReservationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  postReservationActions: {
    gap: 12,
  },
  payNowButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    gap: 8,
    marginBottom: 10,
  },
  payNowButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  payLaterButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#28068E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    gap: 8,
  },
  payLaterButtonText: {
    color: '#28068E',
    fontSize: 16,
    fontWeight: '600',
  },
  summaryPassengers: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  // Styles modaux paiement
  paymentForm: {
    marginBottom: 20,
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
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
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
});

export default App10;