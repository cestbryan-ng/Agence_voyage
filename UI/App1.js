import { React, useState } from 'react';
import { View, StyleSheet, TextInput, Image, Text, TouchableOpacity } from 'react-native';

const App1 = ({ navigation }) => {
    function connexion() {
        if ((numero == '') || (mdp == '')) {
            alert('Entrer votre numéro de téléphone et/ou votre mot de passe.');
            return;
        }
        setnumero('');
        setmdp('');
        navigation.navigate('App6');
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
                    source = {require('C:/Users/ngoup/Documents/Projet/React native/Agence/images/Logoorange.png')}
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
                <TextInput style = {focus2 ? styles.textinputfocus : styles.textinput} secureTextEntry = {visible_mdp}
                    placeholder = 'Votre mot de passe...'
                    onFocus = {() => setfocus2(true)}
                    onBlur = {() => setfocus2(false)}
                    value = {mdp}
                    onChangeText = {setmdp}
                    />
                <TouchableOpacity style = {{marginTop: -30, alignSelf: 'flex-end', marginRight: 10,}} onPress = {(voirMdp)}>
                <Image
                    source = {require('C:/Users/ngoup/Documents/Projet/React native/Agence/images/vue.png')}
                />
                </TouchableOpacity>
                <TouchableOpacity style = {{alignSelf : 'flex-end', paddingTop: 25}} onPress = {(mdpoublie)}>
                    <Text style = {{color : '#F75D37', paddingBottom: 5, fontFamily: "inter", fontSize: 13}}>Mot de passe oublié ?</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.button} onPress = {(connexion)}>
                    <Text style = {{color : '#ffffff', fontFamily: "inter", fontSize: 16, fontWeight : 'bold'}}>Se connecter</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress = {(enregistrer)}>
                    <Text style = {{alignSelf: 'center', paddingTop: 10, fontSize: 14, fontFamily: "nunito", color: '#F75D37', fontWeight : 'bold'}}>Pas de compte ? Créez en un</Text>
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
        backgroundColor : '#F75D37',
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