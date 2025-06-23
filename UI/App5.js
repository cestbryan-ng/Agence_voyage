import { React, use, useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity , TextInput } from 'react-native';

const App5 = ({ navigation }) => {
    function voirMdp() {
        global [visible_mdp, setvisible_mdp];
        if (visible_mdp) setvisible_mdp(false);
        else setvisible_mdp(true);
    }

    function voirMdp2() {
        global [visible_mdp2, setvisible_mdp2];
        if (visible_mdp2) setvisible_mdp2(false);
        else setvisible_mdp2 (true);
    }

    function retour() {
        setmdp1('');
        setmdp2('');
        navigation.navigate('App1');
    }

    function soumettre() {
        if (mdp1 == '' || mdp2 == '') {
            alert('Veuillez entrer votre mot de passe.');
            return;
        }

        if (mdp1 != mdp2) {
            alert('Votre mot de passe est différent.');
            return;
        }

        alert('Mot de passe modifié avec succès, appuyez sur ok pour vous connecter.');
        setmdp1('');
        setmdp2('');
        navigation.navigate('App1');
    }

    const [focus1, setfocus1] = useState(false);
    const [focus2, setfocus2] = useState(true);
    const [mdp1, setmdp1] = useState('');
    const [mdp2, setmdp2] = useState('');
    const [visible_mdp, setvisible_mdp] = useState(true);
    const [visible_mdp2, setvisible_mdp2] = useState(true);

    return (
        <View style = {styles.container}>
            <View style = {styles.container1}>
                <TouchableOpacity style = {{color: '#ffffff', marginLeft: 20}} onPress = {(retour)}>
                    <Image
                        source = {require('./images/Expand_left_light.png')}
                        style = {styles.image_retour}
                    />
                </TouchableOpacity>
                <Text style = {styles.texte}>Vérification</Text>
            </View>
            <View style = {styles.container2}>
                <Image
                    source = {require('./images/screen1.png')}
                    style = {styles.image}
                />
            </View>
            <Text style = {{alignSelf: 'center', paddingTop : 20, fontFamily: 'Inter', fontWeight: 'bold', fontSize : 22, color : 'black'}}>Réinitialiser votre mot de passe</Text>
            <View style = {styles.containeer3}>
                <Text style = {styles.texte3} >Entrer votre nouveau mot de passe</Text>
                <TextInput
                    style = {focus1 ? styles.textinputfocus : styles.textinput}
                    onFocus = {() => setfocus1(true)}
                    onBlur = {() => setfocus1(false)}
                    value = {mdp1}
                    onChangeText = {setmdp1}
                    placeholder = 'Votre mot de passe...'
                    secureTextEntry = {visible_mdp}
                />
                <TouchableOpacity style = {{marginTop: -30, alignSelf: 'flex-end', marginRight: 10, paddingBottom: 20,}} onPress = {(voirMdp)}>
                    <Image
                        source = {require('./images/vue.png')}
                    />
                </TouchableOpacity>
                <Text style = {styles.texte3} >Confirmer votre nouveau mot de passe</Text>
                <TextInput
                    style = {focus2 ? styles.textinputfocus : styles.textinput}
                    onFocus = {() => setfocus2(true)}
                    onBlur = {() => setfocus2(false)}
                    value = {mdp2}
                    onChangeText = {setmdp2}
                    placeholder = 'Confirmer votre mot de passe...'
                    secureTextEntry = {visible_mdp2}
                />
                <TouchableOpacity style = {{marginTop: -30, alignSelf: 'flex-end', marginRight: 10, paddingBottom: 20,}} onPress = {(voirMdp2)}>
                    <Image
                        source = {require('./images/vue.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity  style = {styles.button} onPress = {(soumettre)} >
                    <Text style = {{color : '#ffffff', fontFamily: "inter", fontSize: 16, fontWeight : 'bold'}}  >Soumettre</Text>
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

    containeer3 : {
        alignSelf : 'center',
        width : 300,
        flex : 0,
        marginTop : 15,
    },

    button : {
        marginTop: 20,
        backgroundColor : '#3B82F6',
        height : 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },

    image: {
        height : 260,
        width : 360,
    },

    textinput : {
        color : 'black',
        borderColor : '#D1D1D1',
        borderWidth : 1,
        borderRadius : 15,
        paddingLeft: 10,
        fontSize: 15,
        width : 300,
        fontFamily : "Inter",
        marginRight: 24,
    },

    textinputfocus : {
        color : 'black',
        borderColor : '#009dd1d6',
        borderWidth : 1,
        borderRadius : 15,
        paddingLeft: 10,
        fontSize: 15,
        fontFamily : "Inter",
        width : 300,
        marginRight: 24,
    },

    texte: {
        color : '#2A2A2A',
        fontFamily : 'Inter',
        fontSize : 18,
        fontWeight : 'bold',
        marginTop: -27,
        alignSelf: 'center',
    },

    texte3: {
        color : '#2A2A2A',
        fontFamily : 'Inter',
        fontSize : 14,
        fontWeight : 'bold',
        paddingBottom: 10,
        paddingTop: 15,
    },

});

export default App5;