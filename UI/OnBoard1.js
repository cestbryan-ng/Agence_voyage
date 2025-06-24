import { React } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';

const OnBoard1 =  ({ navigation }) => {
    function suivant() {
        navigation.navigate('App1')
    }

    return (
        <View style={{justifyContent: 'center', flex: 0, paddingLeft: 30, paddingRight: 30}}>
            <Image
                source = {require('./images/56465.png')}
                style = {{width: 362, height: 343, alignSelf: 'center', marginTop: 5}}
            />
            <Text style={{paddingTop: 20, fontWeight: 'bold', color : 'black', fontSize: 30, textAlign : 'center', paddingBottom: 20,}}>
                Votre Marketplace de Voyage au Cameroun
            </Text>
            <Text style={{fontWeight: 'bold', color : 'black', fontSize: 15, textAlign : 'center', paddingBottom: 20,}}> 
               Comparez, choisissez, réservez en toute confiance 
            </Text>
            <Text style={{fontSize: 15, fontFamily: 'Inter', textAlign : 'justify', color : 'black'}}>
                SafaraPlace réunit les meilleures agences de voyage certifiées du Cameroun sur une seule plateforme.
                Explorez les plages de Limbe, les safaris de Waza, le Mont Cameroun et bien plus encore. Comparez les prix, consultez les avis authentiques et réservez en quelques clics.
                Du voyageur solo au groupe familial, nous adaptons chaque expérience à vos envies et votre budget. Découvrez l'authenticité du Cameroun avec SafariPlace.
            </Text>
            <TouchableOpacity onPress = {(suivant)} style = {{width: 60, alignSelf : 'flex-end', marginTop: 0, marginRight: 5}}>
            <Image
                source = {require('./images/fleche.png')}
                style = {{width: 60, height: 60}}
            />
            </TouchableOpacity>
        </View>
    );
};



export default OnBoard1;