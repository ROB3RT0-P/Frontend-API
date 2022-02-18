import React, { Component } from 'react';

import { View, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';
 
  class SO extends Component{

    constructor(props){
    super(props);

    this.state = {
    }
  }

  logout = () => {
    console.log(this.state)
    }

render(){

  const navigation = this.props.navigation;

  return(
    <View>
      <ScrollView>
          <Text style={{ color:'steelblue', backgroundColor:'lightblue', padding:10, fontsize:25}}>Signed Out</Text>

          <View style={{padding:10}}>
              <Text style={{fontsize:15, color:'steelblue'}}>You have signed out successfully, come back soon!</Text>
                
          </View>

          <View style={{padding:10}}>
              <TouchableOpacity
              style={{ backgroundColor:'lightblue', padding:10, alignItems:'center'}}
              onPress={() => this.signIn()}
              >
                  <Text style={{fontSize:20, fontWeight:'bold', color:'steelblue'}}>Sign In Again</Text>
              </TouchableOpacity>
          </View>
          
      </ScrollView>
    </View>
  )
  }
}



export default SO;