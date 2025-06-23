import { React, useState } from 'react';
import { View, StyleSheet, TextInput, Image, Text, TouchableOpacity } from 'react-native';

const App3  = ({ navigation }) => {
    function envoie() {
        if (numero == '') {
            alert('Entrer un numéro.')
            return;
        }
        navigation.navigate('App4', {numero_envoye : numero});
        setnumero('');
    }

    function retour() {
        setnumero('');
        navigation.navigate('App1');
    }

    const [focus, setfocus] = useState(false);
    const [numero, setnumero] = useState('');

    return (
        <View style = {styles.container}>
            <View style = {styles.container1}>
                <TouchableOpacity style = {{color: '#ffffff', marginLeft: 20}} onPress = {(retour)}>
                    <Image
                        source = {require('./images/Expand_left_light.png')}
                        style = {styles.image_retour}
                    />
                </TouchableOpacity>
                <Text style = {styles.texte}>Mot de passe oublié</Text>
            </View>
            <View style = {styles.container2}>
                <Image
                    source = {require('./images/Forgot_1.png')}
                    style = {styles.image}
                />
            </View>
            <View style = {styles.container3}>
                <Text style = {styles.texte1}>Mot de passe oublié?</Text>
                <Text style = {styles.texte2}>N’ayez crainte, ça arrive! Vous devez entrer votre numéro de téléphone, nous vous enverons un code.</Text>
            </View>
            <View style = {styles.container4}>
                <Text style = {styles.texte3}>Entrer votre numéro de téléphone</Text>
                <TextInput
                    style = {focus ? styles.textinputfocus : styles.textinput}
                    placeholder = 'Votre numéro de téléphone...'
                    onFocus = {() => setfocus(true)}
                    onBlur = {() => setfocus(false)}
                    value = {numero}
                    onChangeText = {setnumero}
                    keyboardType = "numeric"
                />
                <TouchableOpacity style = {styles.button} onPress = {(envoie)}>
                    <Text style = {{color : '#ffffff', fontFamily: "inter", fontSize: 16, fontWeight : 'bold'}}>Envoyer le code</Text>
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
        marginTop: 50,
    },
    container2:{
        flex: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        marginTop : 50,
        height : 280,
    },
    container3: {
        flex : 0,
        alignSelf : 'center',
        backgroundColor: '#ffffff',
        marginTop: 50,
        height : 105,
        width : 300,
    },
    container4: {
        flex : 0,
        alignSelf : 'center',
        backgroundColor: '#ffffff',
        height : 105,
        width : 300,
        marginTop: 10,
    },
    image: {
        width : 224.23,
        height : 233,
    },
    texte: {
        color : '#2A2A2A',
        fontFamily : 'Inter',
        fontSize : 18,
        fontWeight : 'bold',
        marginTop: -27,
        alignSelf: 'center',
    },
    texte1: {
        alignSelf : 'center',
        fontWeight : 'bold',
        color : '#2A2A2A',
        fontFamily : 'Inter',
        fontSize: 24,
        paddingBottom: 5,
    },
    texte2: {
        color : '#696969',
        fontFamily : 'Inter',
        fontSize: 14,
        alignItems: 'center',
        textAlign : 'center',
        lineHeight: 21,
    },

    texte3: {
        color : '#2A2A2A',
        fontFamily : 'Inter',
        fontSize : 14,
        fontWeight : 'bold',
        paddingBottom: 10,
        paddingTop: 15,
    },

    textinput : {
        marginLeft : -10,
        color : 'black',
        borderColor : '#D1D1D1',
        borderWidth : 1,
        borderRadius : 15,
        paddingLeft: 10,
        fontSize: 15,
        fontFamily : "cambria",
    },

     textinputfocus : {
        marginLeft : -10,
        borderColor : '#009dd1d6',
        borderWidth : 1,
        borderRadius : 15,
        paddingLeft: 10,
        fontSize: 15,
        fontFamily : "cambria",
    },

    button : {
        marginLeft : -10,
        marginTop: 20,
        backgroundColor : '#3B82F6',
        height : 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
});

export default App3;