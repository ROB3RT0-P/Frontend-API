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


  

  login = async () => {

    return fetch("http://localhost:3333/api/1.0.0/login", {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
    })
    .then((response) => {
        if(response.status === 200){
            return response.json()
        }else if(response.status === 400){
            alert("Incorrect email or password");
            throw 'Invalid email or password';
            
        }else{
            alert("Something went wrong");
            throw 'Something went wrong';
            
        }
    })
    .then(async (responseJson) => {
            console.log(responseJson);
            await AsyncStorage.setItem('@session_token', responseJson.token);
            this.props.navigation.navigate("Home");
    })
    .catch((error) => {
        console.log(error);
    })
}

render(){

  const navigation = this.props.navigation;
  
  return(
    <View>
      <ScrollView>
          <Text style={styles.title}>Login</Text>

          <View style={{padding:10}}>
              <Text style={{fontSize:15, color:'steelblue'}}>Email</Text>
                  <TextInput
                  placeholder="enter email"
                  stye={{borderWidth:1, borderColor: 'lightblue', borderRadius:5}}
                  onChangeText={(firstName) => this.setState({firstName})}
                  value={this.state.email}
              />
          </View>

          <View style={{padding:10}}>
              <Text style={{fontSize:15, color:'steelblue'}}>Password</Text>
                  <TextInput
                  placeholder="enter email"
                  stye={{borderWidth:1, borderColor: 'lightblue', borderRadius:5}}
                  onChangeText={(firstName) => this.setState({firstName})}
                  value={this.state.password}
              />
          </View>

          <View style={{padding:10}}>
              <TouchableOpacity
              style={{ backgroundColor:'lightblue', padding:10, alignItems:'center'}}
              onPress={() => this.login()}
              >
                  <Text style={{fontSize:20, fontWeight:'bold', color:'steelblue'}}>Login</Text>
              </TouchableOpacity>
          </View>

          <View style={{padding:10}}>
              <TouchableOpacity
              style={{ backgroundColor:'lightblue', padding:10, alignItems:'center'}}
              onPress={() => this.props.navigation.navigate("SignUp")}
              >
                  <Text style={{fontSize:20, fontWeight:'bold', color:'steelblue'}}>Sign Up</Text>
              </TouchableOpacity>
          </View>
          
      </ScrollView>
    </View>

  )
  }
}

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

export default Log;