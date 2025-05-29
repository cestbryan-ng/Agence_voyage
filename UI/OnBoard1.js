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
                style = {{width: 362, height: 343, alignSelf: 'center', marginTop: 50}}
            />
            <Text style={{paddingTop: 20, fontWeight: 'bold', color : 'black', fontSize: 26, textAlign : 'center', paddingBottom: 20,}}>
                La meilleure application mobile de voyage du Cameroun
            </Text>
            <Text style={{fontSize: 15, fontFamily: 'inter', textAlign : 'justify'}}>
                Lorem ipsum dolor sit amet consectetur. Mi ultricies ultrices fermentum a. Duis neque lectus pharetra ac sed lorem.
            </Text>
            <TouchableOpacity onPress = {(suivant)}>
            <Image
                source = {require('./images/fleche.png')}
                style = {{width: 40, height: 40, alignSelf: 'center', marginTop: 200, alignSelf: 'flex-end'}}
            />
            </TouchableOpacity>
        </View>
    );
};



export default OnBoard1;