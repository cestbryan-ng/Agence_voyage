import { React, useState } from 'react';
import { View, StyleSheet, TextInput, Image, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';

const App2 = ({ navigation }) => {
    function retour() {
        // Réinitialiser tous les champs
        setnom('');
        setprenom('');
        setemail('');
        setusername('');
        setmdp('');
        setmdp2('');
        setgenre('MALE');
        navigation.navigate('App1');
    }

    const enregistrer = async () => {
        // Validation des champs obligatoires
        if (mdp == '' || username == '' || mdp2 == '' || email == '' || nom == '' || prenom == '') {
            alert("Veuillez remplir au minimum : email, nom d'utilisateur, nom, prenom et mot de passe");
            return;
        }

        if (mdp != mdp2) {
            alert('Votre mot de passe n\'est pas le même, veuillez réessayer.');
            return;
        }

        // Validation simple de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Veuillez entrer un email valide');
            return;
        }

        try {
            setLoading(true);
            // URL de l'API réelle
            const apiUrl = 'http://agence-voyage.ddns.net/api/utilisateur/inscription';
            
            // Données selon le format de l'API
            const userData = {
                last_name: nom || '',          // Optionnel
                first_name: prenom || '',      // Optionnel
                email: email,                  // Obligatoire
                username: username,              // Obligatoire (nom d'utilisateur)
                password: mdp,                 // Obligatoire
                phone_number: username,          // Même valeur que username
                role: ["USAGER"],             // Par défaut pour les utilisateurs
                gender: genre                  // Obligatoire (MALE ou FEMALE)
            };

            console.log('=== DEBUT INSCRIPTION ===');
            console.log('URL:', apiUrl);
            console.log('Données envoyées:', userData);

            const reponse = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            console.log('Statut de la réponse:', reponse.status);

            // Lire la réponse comme texte pour debug
            const responseText = await reponse.text();
            console.log('Réponse brute:', responseText);

            if (reponse.status == 201) {
                // Inscription réussie
                console.log('Inscription réussie !');
                
                // Réinitialiser les champs
                setnom('');
                setprenom('');
                setemail('');
                setusername('');
                setmdp('');
                setmdp2('');
                setgenre('MALE');
                
                Alert.alert(
                    'Inscription réussie !',
                    'Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.',
                    [
                        {
                            text: "Se connecter",
                            onPress: () => navigation.navigate('App1')
                        }
                    ]
                );
            } else {
                if (reponse.status === 409) {
                    Alert.alert(
                        "Erreur d'inscription", 
                        "Inscription échouée.\n\nPossibles causes :\n" +
                        "• Email déjà utilisé\n" +
                        "• nom d'utilisateur déjà utilisé\n" +
                        "• Format des données incorrect"
                    );
                } else {
                    Alert.alert("Erreur serveur", `Erreur ${reponse.status}`);
                }
            } 
        } catch (e) {
            if (e.name === 'TypeError' && e.message.includes('Network request failed')) {
                Alert.alert("Erreur de réseau", "Vérifiez votre connexion internet");
            } else {
                Alert.alert("Erreur", `Une erreur inattendue s'est produite: ${e.message}`);
            }
        } finally {
            setLoading(false);
        }
    }

    function voirMdp() {
        if (visible_mdp) setvisible_mdp(false);
        else setvisible_mdp(true);
    }

    function voirMdp2() {
        if (visible_mdp2) setvisible_mdp2(false);
        else setvisible_mdp2(true);
    }

    // États pour tous les champs
    const [nom, setnom] = useState('');
    const [prenom, setprenom] = useState('');
    const [email, setemail] = useState('');
    const [username, setusername] = useState('');
    const [mdp, setmdp] = useState('');
    const [mdp2, setmdp2] = useState('');
    const [genre, setgenre] = useState('MALE');
    const [loading, setLoading] = useState(false);

    // États pour les focus
    const [focus1, setfocus1] = useState(false);
    const [focus2, setfocus2] = useState(false);
    const [focus3, setfocus3] = useState(false);
    const [focus4, setfocus4] = useState(false);
    const [focus5, setfocus5] = useState(false);

    // États pour la visibilité des mots de passe
    const [visible_mdp, setvisible_mdp] = useState(true);
    const [visible_mdp2, setvisible_mdp2] = useState(true);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.container1}>
                <TouchableOpacity style={{color: '#ffffff', marginLeft: 20}} onPress={retour}>
                    <Image
                        source={require('./images/Expand_left_light.png')}
                        style={styles.image_retour}
                    />
                </TouchableOpacity>
                <Text style={styles.texte}>S'enregistrer</Text>
            </View>
            
            <View style={styles.container2}>
                <Image
                    source={require('./images/safaraplace2.png')}
                    style={styles.image}
                />
            </View>
            
            <View style={styles.container3}>
                {/* Prénom */}
                <Text style={styles.texte1}>Prénom *</Text>
                <TextInput
                    style={focus1 ? styles.textinputfocus : styles.textinput}
                    placeholder='Votre prénom...'
                    onFocus={() => setfocus1(true)}
                    onBlur={() => setfocus1(false)}
                    value={prenom}
                    onChangeText={setprenom}
                />

                {/* Nom (optionnel) */}
                <Text style={styles.texte1}>Nom *</Text>
                <TextInput
                    style={focus2 ? styles.textinputfocus : styles.textinput}
                    placeholder='Votre nom...'
                    onFocus={() => setfocus2(true)}
                    onBlur={() => setfocus2(false)}
                    value={nom}
                    onChangeText={setnom}
                />

                {/* Email (obligatoire) */}
                <Text style={styles.texte1}>Email *</Text>
                <TextInput
                    style={focus3 ? styles.textinputfocus : styles.textinput}
                    placeholder='Votre email...'
                    onFocus={() => setfocus3(true)}
                    onBlur={() => setfocus3(false)}
                    value={email}
                    onChangeText={setemail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                {/* nom d'utilisateur */}
                <Text style={styles.texte1}>Entrer votre nom d'utilisateur *</Text>
                <TextInput
                    style={focus4 ? styles.textinputfocus : styles.textinput}
                    placeholder="Votre nom d'utilisateur..."
                    onFocus={() => setfocus4(true)}
                    onBlur={() => setfocus4(false)}
                    value={username}
                    onChangeText={setusername}
                />

                {/* Genre */}
                <Text style={styles.texte1}>Genre *</Text>
                <View style={styles.genderContainer}>
                    <TouchableOpacity 
                        style={[styles.genderButton, genre === 'MALE' ? styles.genderSelected : null]}
                        onPress={() => setgenre('MALE')}
                    >
                        <Text style={[styles.genderText, genre === 'MALE' ? styles.genderTextSelected : null]}>
                            Homme
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.genderButton, genre === 'FEMALE' ? styles.genderSelected : null]}
                        onPress={() => setgenre('FEMALE')}
                    >
                        <Text style={[styles.genderText, genre === 'FEMALE' ? styles.genderTextSelected : null]}>
                            Femme
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Mot de passe */}
                <Text style={styles.texte1}>Entrer votre mot de passe *</Text>
                <TextInput 
                    style={focus5 ? styles.textinputfocus : styles.textinput} 
                    secureTextEntry={visible_mdp}
                    placeholder='Votre mot de passe...'
                    onFocus={() => setfocus5(true)}
                    onBlur={() => setfocus5(false)}
                    value={mdp}
                    onChangeText={setmdp}
                />
                <TouchableOpacity style={{marginTop: -30, alignSelf: 'flex-end', marginRight: 10, paddingBottom: 20,}} onPress={voirMdp}>
                    <Image source={require('./images/vue.png')} />
                </TouchableOpacity>                

                {/* Confirmer mot de passe */}
                <Text style={styles.texte1}>Confirmer votre mot de passe *</Text>
                <TextInput
                    style={focus3 ? styles.textinputfocus : styles.textinput}
                    secureTextEntry={visible_mdp2}
                    placeholder='Confirmez votre mot de passe...'
                    onFocus={() => setfocus3(true)}
                    onBlur={() => setfocus3(false)}
                    value={mdp2}
                    onChangeText={setmdp2}
                />
                <TouchableOpacity style={{marginTop: -30, alignSelf: 'flex-end', marginRight: 10, paddingBottom: 40,}} onPress={voirMdp2}>
                    <Image source={require('./images/vue.png')} />
                </TouchableOpacity>

                {/* Bouton d'inscription */}
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#3B82F6" />
                    </View>
                ) : (
                <TouchableOpacity style={styles.button} onPress={enregistrer}>
                    <Text style={{color: '#ffffff', fontFamily: "inter", fontSize: 16, fontWeight: 'bold'}}>
                        Enregistrer
                    </Text>
                </TouchableOpacity>)}

                {/* Lien retour connexion */}
                <TouchableOpacity onPress={retour}>
                    <Text style={{alignSelf: 'center', paddingTop: 10, fontSize: 14, fontFamily: "nunito", color: '#3B82F6', fontWeight: 'bold'}}>
                        Vous avez déjà un compte ? Se connecter
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
  
    container1: {
        flex: 0,
        backgroundColor: '#ffffff',
        marginTop: 50,
    },

    container2: {
        flex: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        marginTop: 0,
    },

    container3: {
        flex: 0,
        width: 350,
        marginTop: -20,
        alignSelf: 'center',
        backgroundColor: '#ffffff',
        paddingBottom: 50, // Pour éviter que le contenu soit coupé
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
        height: 45, // Hauteur fixe pour uniformité
    },

    textinputfocus: {
        borderColor: '#009dd1d6',
        borderWidth: 1,
        borderRadius: 15,
        paddingLeft: 10,
        paddingRight: 35,
        fontSize: 15,
        fontFamily: "cambria",
        height: 45,
    },

    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },

    genderButton: {
        flex: 1,
        padding: 12,
        borderWidth: 1,
        borderColor: '#D1D1D1',
        borderRadius: 15,
        alignItems: 'center',
        marginHorizontal: 5,
        backgroundColor: '#ffffff',
    },

    genderSelected: {
        borderColor: '#3B82F6',
        backgroundColor: '#f0f0ff',
    },

    genderText: {
        fontSize: 15,
        color: '#666',
        fontFamily: "cambria",
    },

    genderTextSelected: {
        color: '#3B82F6',
        fontWeight: 'bold',
    },

    texte: {
        color: '#2A2A2A',
        fontFamily: 'Inter',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: -27,
        alignSelf: 'center',
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

    image_retour: {
        width: 24,
        height: 24,
    },
});

export default App2;