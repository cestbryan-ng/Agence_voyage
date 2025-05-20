import { React, useState } from 'react';
import { View, StyleSheet, TextInput, Image, Text, TouchableOpacity } from 'react-native';

const App4 = ({ navigation, route }) => {
    function verification() {
        if (numero1 == '' || numero2 == '' || numero3 == '' || numero4 == '') {
            alert('Entrer le code.')
            return;
        }
        setnumero1('');
        setnumero2('');
        setnumero3('');
        setnumero4('');
        alert("Bientôt disponible");
    }

    function retour() {
        setnumero1('');
        setnumero2('');
        setnumero3('');
        setnumero4('');
        navigation.navigate('App3');
    }

    const { numero_envoye } = route.params;
    const [focus1, setfocus1] = useState(false);
    const [focus2, setfocus2] = useState(false);
    const [focus3, setfocus3] = useState(false);
    const [focus4, setfocus4] = useState(false);
    const [numero1, setnumero1] = useState('');
    const [numero2, setnumero2] = useState('');
    const [numero3, setnumero3] = useState('');
    const [numero4, setnumero4] = useState('');

    return (
        <View style = {styles.container}>
            <View style = {styles.container1}>
                <TouchableOpacity style = {{color: '#ffffff', marginLeft: 20}} onPress = {(retour)}>
                    <Image
                        source = {require('C:/Users/ngoup/Documents/Projet/React native/Agence/images/Expand_left_light.png')}
                        style = {styles.image_retour}
                    />
                </TouchableOpacity>
                <Text style = {styles.texte}>Vérification</Text>
            </View>
            <View style = {styles.container2}>
                <Image
                    source = {require('C:/Users/ngoup/Documents/Projet/React native/Agence/images/img950.png')}
                    style = {styles.image}
                />
            </View>
            <View style = {styles.container3}>
                <Text style = {styles.texte1}>Mot de passe oublié?</Text>
                <Text style = {styles.texte2}>Un code de 4 chiffres a été envoyé à</Text>
                <Text style = {styles.texte3}>{numero_envoye}</Text>
            </View>
            <View style = {styles.container4}>
                <TextInput
                    keyboardType = "numeric"
                    style = {focus1 ? styles.textinputfocus : styles.textinput}
                    onFocus = {() => setfocus1(true)}
                    onBlur = {() => setfocus1(false)}
                    value = {numero1}
                    onChangeText = {setnumero1}
                    editable = { numero1.length != 1 }
                />
                <TextInput
                    keyboardType = "numeric"
                    style = {focus2 ? styles.textinputfocus : styles.textinput}
                    onFocus = {() => setfocus2(true)}
                    onBlur = {() => setfocus2(false)}
                    value = {numero2}
                    onChangeText = {setnumero2}
                    editable = { numero2.length != 1 }
                />
                <TextInput
                    keyboardType = "numeric"
                    style = {focus3 ? styles.textinputfocus : styles.textinput}
                    onFocus = {() => setfocus3(true)}
                    onBlur = {() => setfocus3(false)}
                    value = {numero3}
                    onChangeText = {setnumero3}
                    editable = { numero3.length != 1 }
                />
                <TextInput
                    keyboardType = "numeric"
                    style = {focus4 ? styles.textinputfocus : styles.textinput}
                    onFocus = {() => setfocus4(true)}
                    onBlur = {() => setfocus4(false)}
                    value = {numero4}
                    onChangeText = {setnumero4}
                    editable = { numero4.length != 1 }
                />
            </View>
            <View style = {styles.container5}>
                <TouchableOpacity style = {styles.button} onPress = {(verification)}>
                    <Text style = {{color : '#ffffff', fontFamily: "inter", fontSize: 16, fontWeight : 'bold'}}>Vérifier</Text>
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
        flexDirection: 'row',
        alignSelf : 'center',
        alignItems : 'center',
        backgroundColor: '#ffffff',
        height : 105,
        width : 300,
        marginTop: 30,
    },

    container5 : {
        flex : 0,
        height : 105,
        width : 300,
        alignSelf : 'center',
    },

    image: {
        width : 239.74,
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
        paddingBottom: 7,
    },

    texte2: {
        color : '#696969',
        fontFamily : 'Inter',
        fontSize: 14,
        alignItems: 'center',
        textAlign : 'center',
        lineHeight: 21,
        paddingBottom: 10,
    },  

    texte3 : {
        alignSelf : 'center',
        fontWeight : 'bold',
        color : '#2A2A2A',
        fontFamily : 'Inter',
        fontSize: 20,
        paddingBottom: 7,
    },

    textinput : {
        color : 'black',
        borderColor : '#D1D1D1',
        borderWidth : 1,
        borderRadius : 15,
        paddingLeft: 22,
        fontSize: 20,
        fontFamily : "Inter",
        width : 56.25,
        height : 52,
        marginRight: 24,
    },

    textinputfocus : {
        color : 'black',
        borderColor : '#009dd1d6',
        borderWidth : 1,
        borderRadius : 15,
        paddingLeft: 22,
        fontSize: 20,
        fontFamily : "Inter",
        width : 56.25,
        height : 52,
        marginRight: 24,
    },

    button : {
        marginTop: 20,
        backgroundColor : '#F75D37',
        height : 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
});

export default App4;