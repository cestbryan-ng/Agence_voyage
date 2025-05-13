import React, {useState} from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';





const App = () => {
  function Calculer() {
    var nombre1 = parseFloat(texte), nombre2 = parseFloat(texte1);
    if (isNaN(nombre1) || isNaN(nombre2)) {
      setresultat("Erreur: Veuillez entrer des nombres valides.");
    } else {
      setresultat(nombre1 + nombre2);
    }
  }

  const [texte, settexte] = useState("");
  const [texte1, settexte1] = useState("");
  const [resultat, setresultat] = useState("");

  return (
    <View style={styles.container}>
      <TextInput defaultValue = {texte} onChangeText = {newtexte => settexte(newtexte)}
      placeholder = "Entrer un nombre..." />
            <TextInput defaultValue = {texte1} onChangeText = {newtexte => settexte1(newtexte)}
      placeholder = "Entrer un deuxième nombre..." />
      <Button title = "Calculer" onPress = {Calculer}  />
      <Text>{resultat}</Text>
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
});

export default App;