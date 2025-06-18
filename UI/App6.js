import { React, useEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';

const App6 = ({ navigation, route }) => {
    useEffect(() => {
        const temps = setTimeout(() => {
            navigation.navigate('App8', {
                        nom_envoye: nom_envoye,
                        userData: userData,
                        token: token
                    }); 
        }, 4000);

        return () => clearTimeout(temps);
    }, []);

    const { nom_envoye, userData, token } = route.params

    return (
        <View style = {styles.container}>
            <Image
                source = {require('./images/congratulations.png')}
                style = {styles.image}
            />
            <Text style = {{paddingTop: 50, fontFamily: 'cambria', fontSize: 15, fontWeight: 'bold', color : 'black'}}>Vous allez être redigirer vers la page d'accueil</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    },

    image: {
        height : 178,
        width : 233.77,
    },
});

export default App6;