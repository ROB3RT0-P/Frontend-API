import React, { Component } from 'react';

import { View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
 
  class Log extends Component{

    constructor(props){
    super(props);

    this.state = {
     email: '',
     password: '',
    }
  }

  login = () => {
    console.log(this.state)
    }

render(){

  const navigation = this.props.navigation;
  
  return(
    <View>
      <ScrollView>
          <Text style={styles.title}>Login</Text>

          <View style={{padding:10}}>
              <Text style={{fontsize:15, color:'steelblue'}}>Email</Text>
                  <TextInput
                  placeholder="enter email"
                  stye={{borderWidth:1, borderColor: 'lightblue', borderRadius:5}}
                  onChangeText={(firstName) => this.setState({firstName})}
                  value={this.state.email}
              />
          </View>

          <View style={{padding:10}}>
              <Text style={{fontsize:15, color:'steelblue'}}>Password</Text>
                  <TextInput
                  placeholder="enter email"
                  stye={{borderWidth:1, borderColor: 'lightblue', borderRadius:5}}
                  onChangeText={(firstName) => this.setState({firstName})}
                  value={this.state.email}
              />
          </View>

          <View style={{padding:10}}>
              <TouchableOpacity
              style={{ backgroundColor:'lightblue', padding:10, alignItems:'center'}}
              onPress={() => this.signUp()}
              >
                  <Text style={{fontSize:20, fontWeight:'bold', color:'steelblue'}}>Sign In</Text>
              </TouchableOpacity>
          </View>
          
      </ScrollView>
    </View>

  )
  }
}



export default Log;