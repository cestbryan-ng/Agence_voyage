import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      <Button style = {styles.text} title="Appuie ici" onPress={() => alert("Hello World !")} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  text: {
    fontSize: 24,
    color: 'red',
  },
});

export default App;