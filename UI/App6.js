import { React, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';

const App6 = ({ navigation }) => {
    useEffect(() => {
        const temps = setTimeout(() => {
            navigation.navigate('App7'); 
        }, 2000);

        return () => clearTimeout(temps);
    }, []);

    return (
        <View style = {styles.container}>
            <Image
                source = {require('C:/Users/ngoup/Documents/Projet/React native/Agence/images/congratulations.png')}
                style = {styles.image}
            />
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