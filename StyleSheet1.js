
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const App = () => (
  <View style={styles.container}>
    <Text style={styles.title}>React Native</Text>
  </View>
);


const styles = StyleSheet.create({
    title: {
      color:'steelblue',
      backgroundColor: "lightblue",
      padding:10,
      fontSize:25
    },
   
    formItem: {
      padding:20,
    },
   
    formLabel: {
      fontSize:15,
      color:'steelblue'
    },
   
    formInput: {
      borderWidth:1,
      borderColor: 'lightblue',
      borderRadius: 5
    },
   
    formTouch: {
      backgroundColor:'lightblue',
      padding:10,
      alignItems:'center'
    },
   
    formTouchText:{
      fontSize:20,
      fontWeight:'bold',
      color:'steelblue'
    }
    
  });