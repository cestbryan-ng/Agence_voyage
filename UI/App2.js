import { React, useState } from 'react';
import { View, StyleSheet, TextInput, Image, Text, TouchableOpacity } from 'react-native';

const App2 = () => {
    function envoieauServeur() {
        alert("Bientôt disponible");
    }

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

    const [focus1, setfocus1] = useState(false);
    const [focus2, setfocus2] = useState(false);
    const [focus3, setfocus3] = useState(false);
    const [visible_mdp, setvisible_mdp] = useState(true);
    const [visible_mdp2, setvisible_mdp2] = useState(true);

    return  (
        <View style = {styles.container}>
            <View style = {styles.container1}>
                <TouchableOpacity style = {{color: '#ffffff', marginLeft: 20}}>
                    <Image
                        source = {require('C:/Users/ngoup/Documents/Projet/React native/Agence/images/Expand_left_light.png')}
                        style = {styles.image_retour}
                    />
                </TouchableOpacity>
                <Text style = {styles.texte}>S'enregistrer</Text>
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
                />
                <Text style = {styles.texte1}>Entrer votre mot de passe</Text>
                <TextInput style = {focus2 ? styles.textinputfocus : styles.textinput} secureTextEntry = {visible_mdp}
                    placeholder = 'Votre mot de passe...'
                    onFocus = {() => setfocus2(true)}
                    onBlur = {() => setfocus2(false)}
                />
                <TouchableOpacity style = {{marginTop: -30, alignSelf: 'flex-end', marginRight: 10, paddingBottom: 20,}} onPress = {(voirMdp)}>
                    <Image
                        source = {require('C:/Users/ngoup/Documents/Projet/React native/Agence/images/vue.png')}
                    />
                </TouchableOpacity>                
                <Text style = {styles.texte1}>Confirmer votre mot de passe</Text>
                <TextInput
                    style = {focus3 ? styles.textinputfocus : styles.textinput}
                    secureTextEntry = {visible_mdp2}
                    placeholder = 'Votre mot de passe...'
                    onFocus = {() => setfocus3(true)}
                    onBlur = {() => setfocus3(false)}
                />
                <TouchableOpacity style = {{marginTop: -30, alignSelf: 'flex-end', marginRight: 10, paddingBottom: 40,}} onPress = {(voirMdp2)}>
                    <Image
                        source = {require('C:/Users/ngoup/Documents/Projet/React native/Agence/images/vue.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity style = {styles.button} onPress = {(envoieauServeur)}>
                    <Text style = {{color : '#ffffff', fontFamily: "inter", fontSize: 16, fontWeight : 'bold'}}>Enregistrer</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress = {(envoieauServeur)}>
                    <Text style = {{alignSelf: 'center', paddingTop: 10, fontSize: 14, fontFamily: "nunito", color: '#F75D37', fontWeight : 'bold'}}>Vous avez déjà un compte ? Se connecter</Text>
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
    marginTop: -27,
    alignSelf: 'center',
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

  image_retour: {
    width : 24,
    height : 24,
  },
});

export default App2;

