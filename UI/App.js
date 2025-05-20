import { React, useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const App = ({ navigation }) => {
    useEffect(() => {
        const temps = setTimeout(() => {
            navigation.navigate('App1'); 
        }, 2000);

        return () => clearTimeout(temps);
    }, []);

    return (
        <View style={styles.container}>
            <Image 
                source = {require('./images/frame.png')} 
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