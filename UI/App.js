import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const App = () => {
    return (
        <View style={styles.container}>
            <Image 
                source = {require('C:/Users/ngoup/Documents/Projet/React native/Agence/images/Frame37240.png')} 
                style = {styles.image}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F75D37',
    },
    image: {
        width : 300,
        height : 300,
    },
});

export default App;