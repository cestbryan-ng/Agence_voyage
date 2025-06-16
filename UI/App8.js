import { React , useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  ImageBackground,
  Animated,
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

const App8 = ({ navigation }) => {
  function voyage() {
    navigation.navigate('App10');
  }

  function reserver() {
    navigation.navigate('App9');
  }

  const [sideMenuVisible, setSideMenuVisible] = useState(false)

  const toggleSideMenu = () => {
    setSideMenuVisible(!sideMenuVisible);
  };

  const closeSideMenu = () => {
    setSideMenuVisible(false);
  };

  function deconnexion() {
    navigation.navigate('App1')
  }

  return (
    <View style={styles.container}>
      
        {/* Header avec image de fond */}
        <ImageBackground style = {{height: 180}} source = {require('./images/lesnuages.png')}> 
            <View style={styles.tete}>
                <View style={styles.headerOverlay}>
                    {/* Top bar */}
                    <View style={styles.topBar}>
                        <TouchableOpacity style = {{backgroundColor : '#f3f3f386', borderRadius: 5, padding : 7}} onPress={toggleSideMenu}>
                            <Icon name="menu" size={31} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.profileButton}>
                          <Icon name="person" size={40} color="gray" />
                        </TouchableOpacity>
                    </View>

                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <Image
                            source = {require('./images/safaraplace.png')}
                            style = {{width: 200, height: 200,}}
                        />
                    </View>

                    {/* Barre de recherche */}
                </View>
            </View>
        </ImageBackground>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Catégories */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Catégories</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>Voir tout</Text>
                    </TouchableOpacity>
                </View>
          
                <View style={styles.categoriesContainer}>
                    <TouchableOpacity style={styles.categoryItem} onPress={(reserver)}>
                        <View style={styles.categoryIcon}>
                        <FontAwesome name="bus" size={35} color="#28068E" />
                        </View>
                        <Text style={styles.categoryText}>Réserver</Text>
                    </TouchableOpacity>
            
            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <FontAwesome name="ticket" size={35} color="#28068E" />
              </View>
              <Text style={styles.categoryText}>Mes tickets</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <FontAwesome name="percent" size={35} color="#28068E" />
              </View>
              <Text style={styles.categoryText}>Promotion</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <FontAwesome name="history" size={35} color="#28068E" />
              </View>
              <Text style={styles.categoryText}>Historique</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Voyages */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Voyages</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.visitedContainer}>
              <TouchableOpacity style={styles.visitedCard} onPress={(voyage)}>
                <Image
                  source= {require('./images/Blue-Bird-Express-1024x603.png')}
                  style={styles.visitedImage}
                />
                <View style={styles.visitedInfo}>
                  <Text style={styles.visitedTitle}>Blue Bird</Text>
                  <View style={styles.locationInfo}>
                    <Icon name="schedule" size={15} color="white" />
                    <Text style={styles.locationText}>11/06/2025 05:00</Text>
                  </View>
                  <View style={styles.locationInfo}>
                    <Icon name="location-on" size={12} color="white" />
                    <Text style={styles.locationText}>Bafoussam à Yaoundé</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.visitedCard} onPress={(voyage)}>
                <Image
                  source={require('./images/OIP.png')}
                  style={styles.visitedImage}
                />
                <View style={styles.visitedInfo}>
                  <Text style={styles.visitedTitle}>General Express</Text>
                  <View style={styles.locationInfo}>
                    <Icon name="schedule" size={15} color="white" />
                    <Text style={styles.locationText}>10/06/2025 08:00</Text>
                  </View>
                  <View style={styles.locationInfo}>
                    <Icon name="location-on" size={12} color="white" />
                    <Text style={styles.locationText}>Douala à Yaoundé</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.visitedCard} onPress={(voyage)}>
                <Image
                  source={require('./images/777-2.png')}
                  style={styles.visitedImage}
                />
                <View style={styles.visitedOverlay}>
                  <View style={styles.ratingContainer}>
                    <FontAwesome name="star" size={12} color='white' />
                    <Text style={styles.ratingText}>4.2</Text>
                  </View>
                  <View style={styles.favoriteButton}>
                    <FontAwesome name="heart-o" size={16} color="white" />
                  </View>
                </View>
                <View style={styles.visitedInfo}>
                  <Text style={styles.visitedTitle}>Touristique Express</Text>
                  <View style={styles.locationInfo}>
                    <Icon name="schedule" size={15} color="white" />
                    <Text style={styles.locationText}>08/06/2025 05:00</Text>
                  </View>
                  <View style={styles.locationInfo}>
                    <Icon name="location-on" size={12} color="white" />
                    <Text style={styles.locationText}>Yaoundé à Bafoussam</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Agences */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Agences</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.agenciesContainer}>
              <TouchableOpacity style={styles.agencyCard}>
                <Image
                  source={require('./images/OIP.png')}
                  style={styles.agencyImage}
                />
                <Text style = {{position : 'absolute', color : 'white', fontWeight: 'bold', fontSize: 15, marginTop: 80, alignSelf : 'center', paddingLeft : 5, paddingRight : 5, textAlign : 'center'}}>General Express Voyage</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.agencyCard}>
                <Image
                  source={require('./images/777-2.png')}
                  style={styles.agencyImage}
                />
                <Text style = {{position : 'absolute', color : 'white', fontWeight: 'bold', fontSize: 15, marginTop: 95, alignSelf : 'center', paddingLeft : 5, paddingRight : 5, textAlign : 'center'}}>Touristique Express</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.agencyCard}>
                <Image
                  source={require('./images/Blue-Bird-Express-1024x603.png')}
                  style={styles.agencyImage}
                />
                <Text style = {{position : 'absolute', color : 'white', fontWeight: 'bold', fontSize: 15, marginTop: 95, alignSelf : 'center', paddingLeft : 5, paddingRight : 5, textAlign : 'center'}}>BlueBird</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.bottomNavItem} disabled = {true}>
          <FontAwesome name="home" size={25} color="#28068E" />
          <Text style={[styles.bottomNavText, styles.bottomNavTextActive]}>Accueil</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bottomNavItem}>
          <FontAwesome name="ticket" size={25} color="#666" />
          <Text style={styles.bottomNavText}>Ticket</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bottomNavItem}>
          <FontAwesome name="bell-o" size={25} color="#666" />
          <Text style={styles.bottomNavText}>Notification</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bottomNavItem}>
          <FontAwesome name="comment-o" size={25} color="#666" />
          <Text style={styles.bottomNavText}>Messages</Text>
        </TouchableOpacity>
      </View>

      {/* Side Menu Modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={sideMenuVisible}
        onRequestClose={closeSideMenu}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackground} 
            onPress={closeSideMenu}
            activeOpacity={1}
          />
          <View style={styles.sideMenu}>
            {/* Close button */}
            <TouchableOpacity style={styles.closeButton} onPress={closeSideMenu}>
              <Icon name="close" size={24} color="#ff4444" />
            </TouchableOpacity>

            {/* Menu Items */}
            <ScrollView style={styles.menuContent} showsVerticalScrollIndicator={false}>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuItemText}>Passer en Premium</Text>
                <Icon name="chevron-right" size={20} color="#666" />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuItemText}>Thèmes</Text>
                <Icon name="chevron-right" size={20} color="#666" />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuItemText}>Services supplémentaires</Text>
                <Icon name="chevron-right" size={20} color="#666" />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuItemText}>Paramètres</Text>
                <Icon name="chevron-right" size={20} color="#666" />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuItemText}>Contacter le support</Text>
                <Icon name="chevron-right" size={20} color="#666" />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuItemText}>Reporter un problème</Text>
                <Icon name="chevron-right" size={20} color="#666" />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <View style={styles.versionContainer}>
                <Text style={styles.versionText}>Version 1.0.0</Text>
              </View>

              <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={deconnexion}>
                <Text style={styles.menuItemTextLog}>Se Deconnecter</Text>
              </TouchableOpacity>
            </ScrollView>
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
  },
  tete: {
    height: 200,
    flex: 1,
    zIndex : 10,
  },
  headerOverlay: {
    flex: 1,
    paddingLeft : 20,
    paddingRight : 20,
    paddingTop: 5,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop : 20,
    marginBottom: -30,
  },
  homeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  profileButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  logoContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    width: 200,
    marginTop: 10,
  },
  logoText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  logoSubtext: {
    fontSize: 14,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    height: 50,
    marginTop: -23,
  },
  searchContainerfocus : {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    height: 50,
    marginTop: -23,
    borderColor: '#009dd1d6',
    borderWidth: 1,
  },
  searchIcon: {
    marginLeft: 15,
    marginRight: -10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color : 'black',
    paddingLeft: 15,
    fontSize: 17,
    fontFamily: 'Inter',
  },
  searchInputfocus: {
    borderColor: '#009dd1d6',
    borderWidth: 1,
    flex: 1,
    fontSize: 16,
    color : 'black',
    paddingLeft: 15,
    fontSize: 17,
    fontFamily: 'Inter',
  },
  content: {
    flex: 1,
    marginTop: -20,
    backgroundColor: '#f8f9fa',
    zIndex : 1,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#28068E',
    fontWeight: '500',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryItem: {
    alignItems: 'center',
    width: (width - 60) / 4,
    backgroundColor : 'white',
    borderRadius: 20,
    width: 80,
    paddingBottom: 10,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  visitedContainer: {
    flexDirection: 'row',
    paddingLeft: 1,
  },
  visitedCard: {
    width: 220,
    marginRight: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  visitedImage: {
    width: '100%',
    height: 180,
  },
  visitedOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  ratingText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
  favoriteButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visitedInfo: {
    position: 'absolute',
    padding: 12,
    marginTop: 90,
  },
  visitedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
    fontSize: 20,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: 'white',
    marginLeft: 2,
  },
  servicesContainer: {
    flexDirection: 'row',
  },
  serviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28068E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  serviceText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 6,
  },
  agenciesContainer: {
    flexDirection: 'row',
  },
  agencyCard: {
    width: 170,
    marginRight: 15,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  agencyImage: {
    height: 120,
  },
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
  // Side Menu Styles
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sideMenu: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.75,
    backgroundColor: 'white',
    paddingTop: 50,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  menuContent: {
    flex: 1,
    paddingTop: 60,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: 'white',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  menuItemTextLog: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 20,
  },
  versionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '400',
  },
  logoutItem: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});

export default App8;