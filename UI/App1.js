import { React, useState } from 'react';
import { View, StyleSheet, TextInput, Image, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

const App1 = ({ navigation }) => {
    const connexion = async () => {
        if ((username == '') || (password == '')) {
            alert('Entrer votre numéro de téléphone et/ou votre mot de passe.');
            return;
        }

        try {
            setLoading(true);
            // URL de l'API selon le swagger
            const apiUrl = 'http://agence-voyage.ddns.net/api/utilisateur/connexion';
            
            // Données à envoyer selon l'API
            const authentificationData = {
                username: username,  // L'API attend 'username'
                password: password      // L'API attend 'password'
            };

            console.log('=== DEBUT DEBUG CONNEXION ===');
            console.log('URL:', apiUrl);
            console.log('Données envoyées:', authentificationData);
            console.log('JSON stringifié:', JSON.stringify(authentificationData));

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'accept': '*/*',  // Exactement comme dans ta commande cURL
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(authentificationData)
            });

            console.log('Statut de la réponse:', response.status);
            console.log('Headers de la réponse:', response.headers);

            // Toujours lire la réponse comme texte d'abord pour debug
            const responseText = await response.text();

            if (response.status == 200) {
                // Essayer de parser en JSON
                let userData;
                try {
                    userData = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('Erreur parsing JSON:', parseError);
                    Alert.alert("Erreur", "Réponse invalide du serveur");
                    return;
                }

                if (userData && userData.token) {
                    // Connexion réussie
                    console.log('Connexion réussie pour:', userData.username);
                    
                    // Réinitialisation des champs
                    setusername('');
                    setpassword('');
                    
                    // Navigation avec les données utilisateur
                    navigation.navigate('App6', {
                        nom_envoye: userData.first_name || userData.username,
                        userData: userData,
                        token: userData.token
                    });
                } else {
                    console.log('Pas de token dans la réponse');
                    Alert.alert("Erreur", "Réponse invalide du serveur");
                }
            } else {
                // Cette API retourne 500 pour TOUTES les erreurs (mauvais design mais c'est comme ça)
                console.log('=== ERREUR HTTP ===');
                console.log('Status:', response.status);
                console.log('Status Text:', response.statusText);
                console.log('Response:', responseText);
                
                if (response.status === 500) {
                    // Comme l'API retourne 500 pour tout, on suppose que c'est un problème d'authentification
                    Alert.alert(
                        "Connexion échouée", 
                        "Vérifiez vos identifiants ou créez un compte.\n\n" +
                        "Possibles causes :\n" +
                        "• Numéro de téléphone incorrect\n" +
                        "• Mot de passe incorrect\n" +
                        "• Compte inexistant"
                    );
                } else {
                    Alert.alert("Erreur serveur", `Erreur ${response.status}: ${response.statusText}`);
                }
            }
            console.log('=== FIN DEBUG CONNEXION ===');
        } catch (error) {
            console.error('=== ERREUR CATCH ===');
            console.error('Type:', error.name);
            console.error('Message:', error.message);
            console.error('Stack:', error.stack);
            
            if (error.name === 'TypeError' && error.message.includes('Network request failed')) {
                Alert.alert("Erreur de réseau", "Vérifiez votre connexion internet");
            } else {
                Alert.alert("Erreur", `Une erreur inattendue s'est produite: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    }

    function google() {
        Alert.alert('Pas encore disponible', 'Revenez plus tard')
    }

    function passwordoublie() { 
        setusername('');
        setpassword('');
        navigation.navigate('App3');
    }

    function enregistrer() {
        setusername('');
        setpassword('');
        navigation.navigate('App2');
    }

    function voirpassword() {
        if (visible_password) setvisible_password(false);
        else setvisible_password(true);
    }

    const [focus1, setfocus1] = useState(false);
    const [focus2, setfocus2] = useState(false);
    const [visible_password, setvisible_password] = useState(true);
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [loading, setLoading] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.container2}>
                <Text style={styles.texte}>Se connecter</Text>
            </View>
            <View style={styles.container2}>
                <Image
                    source={require('./images/safaraplace2.png')}
                    style={styles.image}
                />
            </View>
            <View style={styles.container3}>
                <Text style={styles.texte1}>Entrer votre nom d'utilisateur</Text>
                <TextInput
                    style={focus1 ? styles.textinputfocus : styles.textinput}
                    placeholder='Votre numéro de téléphone...'
                    onFocus={() => setfocus1(true)}
                    onBlur={() => setfocus1(false)}
                    value={username}
                    onChangeText={setusername}
                    keyboardType="phone-pad"
                />
                <Text style={styles.texte1}>Entrer votre mot de passe</Text>
                <TextInput 
                    style={focus2 ? styles.textinputfocus : styles.textinput} 
                    secureTextEntry={visible_password}
                    placeholder='Votre mot de passe...'
                    onFocus={() => setfocus2(true)}
                    onBlur={() => setfocus2(false)}
                    value={password}
                    onChangeText={setpassword}
                />
                <TouchableOpacity style={{marginTop: -30, alignSelf: 'flex-end', marginRight: 10,}} onPress={voirpassword}>
                    <Image source={require('./images/vue.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={{alignSelf: 'flex-end', paddingTop: 25}} onPress={passwordoublie}>
                    <Text style={{color: '#3B82F6', paddingBottom: 5, fontFamily: "inter", fontSize: 13}}>Mot de passe oublié ?</Text>
                </TouchableOpacity>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#3B82F6" />
                    </View>
                ) : (
                <TouchableOpacity style={styles.button} onPress={connexion}>
                    <Text style={{color: '#ffffff', fontFamily: "inter", fontSize: 16, fontWeight: 'bold'}}>Se connecter</Text>
                </TouchableOpacity>)}
                <TouchableOpacity onPress={enregistrer}>
                    <Text style={{alignSelf: 'center', paddingTop: 10, fontSize: 14, fontFamily: "nunito", color: '#3B82F6', fontWeight: 'bold'}}>Pas de compte ? Créez en un</Text>
                </TouchableOpacity>
                <Text style={{alignSelf: 'center', paddingTop: 15, paddingBottom: 15,}}>ou</Text>
                <TouchableOpacity style={{borderWidth: 1, borderColor: '#D1D1D1', borderRadius: 20, width: 300, alignSelf: 'center', flexDirection: 'row', height: 45}} onPress={google}>
                    <Image
                        source={require('./images/google.png')}
                        style={{width: 25, height: 25, alignSelf: 'center', marginLeft: 60,}}
                    />
                    <Text style={{alignSelf: 'center', fontFamily: 'nunito', fontWeight: 'bold', color: 'black', marginLeft: 10}}>Continuer avec Google</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Styles restent identiques
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
  
    container1: {
        flex: 0,
        backgroundColor: '#ffffff',
    },

    container2: {
        flex: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        marginTop: 50,
    },

    container3: {
        flex: 0,
        width: 350,
        height: 400,
        marginTop: 20,
        alignSelf: 'center',
        backgroundColor: '#ffffff',
    },

    textinput: {
        color: 'black',
        borderColor: '#D1D1D1',
        borderWidth: 1,
        borderRadius: 15,
        paddingLeft: 10,
        paddingRight: 35,
        fontSize: 15,
        fontFamily: "cambria",
    },

    textinputfocus: {
        borderColor: '#009dd1d6',
        borderWidth: 1,
        borderRadius: 15,
        paddingLeft: 10,
        paddingRight: 35,
        fontSize: 15,
        fontFamily: "cambria",
    },

    texte: {
        color: '#2A2A2A',
        fontFamily: 'Inter',
        fontSize: 18,
        fontWeight: 'bold',
    },

    texte1: {
        color: '#2A2A2A',
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: 'bold',
        paddingBottom: 10,
        paddingTop: 15,
    },

    button: {
        backgroundColor: '#3B82F6',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },

    image: {
        width: 180,
        height: 180,
    },
});

export default App1;