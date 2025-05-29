import { React, useState } from 'react';
import { View, StyleSheet, TextInput, Image, Text, TouchableOpacity, Alert } from 'react-native';

const App1 =  ({ navigation }) => {
    const connexion = async () => {
        if ((numero == '') || (mdp == '')) {
            alert('Entrer votre numéro de téléphone et/ou votre mot de passe.');
            return;
        }

        try {
            const reponse = await fetch('http://10.0.2.2:5454/connexion', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    numero : numero,
                    mdp : mdp
                })
            })

            const resultat = await reponse.json();
            if (resultat.result) {
                setnumero('');
                setmdp('');
                navigation.navigate('App6');
            } else {
                Alert.alert("Compte inexistant", "Votre compte n'existe pas")
            }
        } catch (e) {
            console.error(e)
            Alert.alert("Echec de connexion", "Connectez vous à internet")
        }
    }

    function google() {
        Alert.alert('Pas encore disponible', 'Revenez plus tard')
    }

    function mdpoublie() { 
        setnumero('');
        setmdp('');
        navigation.navigate('App3');
    }

    function enregistrer() {
        setnumero('');
        setmdp('');
        navigation.navigate('App2');
    }

    function voirMdp() {
        global [visible_mdp, setvisible_mdp];
        if (visible_mdp) setvisible_mdp(false);
        else setvisible_mdp(true);
    }

    const [focus1, setfocus1] = useState(false);
    const [focus2, setfocus2] = useState(false);
    const [visible_mdp, setvisible_mdp] = useState(true);
    const [numero, setnumero] = useState('');
    const [mdp, setmdp] = useState('');

    return (
        <View style = {styles.container}>
            <View style = {styles.container2}>
                <Text style = {styles.texte}>Se connecter</Text>
            </View>
            <View style = {styles.container2}>
                <Image
                    source = {require('./images/safaraplace2.png')}
                    style = {styles.image}
                />
            </View>
            <View style = {styles.container3}>
                <Text style = {styles.texte1}>Entrer votre numéro de téléphone</Text>
                <TextInput
                    style = {focus1 ? styles.textinputfocus : styles.textinput}
                    placeholder = 'Votre numéro de téléphone...'
                    onFocus = {() => setfocus1(true)}
                    onBlur = {() => setfocus1(false)}
                    value = {numero}
                    onChangeText = {setnumero}
                />
                <Text style = {styles.texte1}>Entrer votre mot de passe</Text>
                <TextInput style = {focus2 ? styles.textinputfocus : styles.textinput} 
                    secureTextEntry = {visible_mdp}
                    placeholder = 'Votre mot de passe...'
                    onFocus = {() => setfocus2(true)}
                    onBlur = {() => setfocus2(false)}
                    value = {mdp}
                    onChangeText = {setmdp}
                    />
                <TouchableOpacity style = {{marginTop: -30, alignSelf: 'flex-end', marginRight: 10,}} onPress = {(voirMdp)}>
                <Image
                    source = {require('./images/vue.png')}
                />
                </TouchableOpacity>
                <TouchableOpacity style = {{alignSelf : 'flex-end', paddingTop: 25}} onPress = {(mdpoublie)}>
                    <Text style = {{color : '#28068E', paddingBottom: 5, fontFamily: "inter", fontSize: 13}}>Mot de passe oublié ?</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.button} onPress = {(connexion)}>
                    <Text style = {{color : '#ffffff', fontFamily: "inter", fontSize: 16, fontWeight : 'bold'}}>Se connecter</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress = {(enregistrer)}>
                    <Text style = {{alignSelf: 'center', paddingTop: 10, fontSize: 14, fontFamily: "nunito", color: '#28068E', fontWeight : 'bold'}}>Pas de compte ? Créez en un</Text>
                </TouchableOpacity>
                <Text style = {{alignSelf: 'center', paddingTop: 15, paddingBottom: 15,}} >ou</Text>
                <TouchableOpacity style = {{borderWidth: 1, borderColor: '#D1D1D1' , borderRadius: 20, width : 300, alignSelf : 'center', flexDirection: 'row', height: 45}} onPress = {(google)}>
                    <Image
                        source = {require('./images/google.png')}
                        style = {{width : 25, height : 25, alignSelf: 'center', marginLeft: 60,}}
                    />
                    <Text style = {{alignSelf: 'center', fontFamily: 'nunito', fontWeight: 'bold', color : 'black', marginLeft: 10}}>Continuer avec Google</Text>
                </TouchableOpacity>
            </View>
        </View>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
  
    container1: {
        flex : 0,
        backgroundColor: '#ffffff',
    },

    container2:{
        flex: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        marginTop : 50,
    },

    container3 : {
        flex: 0,
        width : 350,
        height : 400,
        marginTop : 20,
        alignSelf : 'center',
        backgroundColor: '#ffffff',
    },

    textinput : {
        color : 'black',
        borderColor : '#D1D1D1',
        borderWidth : 1,
        borderRadius : 15,
        paddingLeft: 10,
        paddingRight: 35,
        fontSize: 15,
        fontFamily : "cambria",
    },

    textinputfocus : {
        borderColor : '#009dd1d6',
        borderWidth : 1,
        borderRadius : 15,
        paddingLeft: 10,
        paddingRight: 35,
        fontSize: 15,
        fontFamily : "cambria",
    },

    texte: {
        color : '#2A2A2A',
        fontFamily : 'Inter',
        fontSize : 18,
        fontWeight : 'bold',
    },

    texte1: {
        color : '#2A2A2A',
        fontFamily : 'Inter',
        fontSize : 14,
        fontWeight : 'bold',
        paddingBottom: 10,
        paddingTop: 15,
    },

    button : {
        backgroundColor : '#28068E', // #582df3
        height : 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },

    image: {
        width : 180,
        height : 180,
    },
});

export default App1;