import { React, useEffect } from 'react';
import { View, StyleSheet, Image , Text } from 'react-native';

const App7 = ({ navigation }) => {
    useEffect(() => {
        const temps = setTimeout(() => {
            navigation.navigate('App1'); 
        }, 3000);

        return () => clearTimeout(temps);
    }, []);

    return (
        <View style = {styles.container}>
            <Image
                source = {require('C:/Users/ngoup/Documents/Projet/React native/Agence/images/7VVL.gif')}
                style = {styles.image}
            />
            <Text style = {{paddingTop: 20, fontFamily: 'cambria', fontSize: 20, fontWeight: 'bold',}}>On y travaille...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffc600',
    },

    image: {
        height : 178,
        width : 233.77,
    },
});

export default App7;