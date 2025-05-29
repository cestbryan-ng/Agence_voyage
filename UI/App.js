import { React, useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const App = ({ navigation }) => {
    useEffect(() => {
        const temps = setTimeout(() => {
            navigation.navigate('OnBoard1'); 
        }, 2000);

        return () => clearTimeout(temps);
    }, []);

    return (
        <View style={styles.container}>
            <Image 
                source = {require('./images/safaraplace.png')} 
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
        backgroundColor: '#28068E',
    },
    image: {
        width : 300,
        height : 300,
    },
});

export default App;