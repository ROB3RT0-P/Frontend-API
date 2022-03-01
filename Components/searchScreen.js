import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';


class SearchScreen extends Component{
  constructor(props){
    super(props);

    
  }




  render(){
    if(this.state.hasPermission){
      return(
         null
      );
    }else{
      return(
        <Text></Text>
      );
    }
  }
}

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
