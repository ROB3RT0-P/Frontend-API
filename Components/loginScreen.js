import React, { Component } from 'react';

import { View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Log extends Component {

  constructor(props) {
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
        if (response.status === 200) {
          return response.json()
        } else if (response.status === 400) {
          alert("Incorrect email or password");
          throw 'Invalid email or password';
        } else {
          alert("Something went wrong");
          throw 'Something went wrong';
        }
      })
      .then(async (responseJson) => {
        console.log(responseJson);
        await AsyncStorage.setItem('@session_token', responseJson.token);
        await AsyncStorage.setItem('@user_id', JSON.stringify(responseJson.id));
        let global_id = await AsyncStorage.getItem('@user_id');
        this.props.navigation.navigate("Home");
        console.log(global_id)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  render() {
    const navigation = this.props.navigation;
    return (
      <ScrollView>
        <TextInput
          placeholder="Enter your email..."
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
          style={stylesLogin.textInput}
        />
        <TextInput
          placeholder="Enter your password..."
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
          secureTextEntry
          style={stylesLogin.textInput}
        />
        <View style={{ padding: 10 }}>
          <TouchableOpacity
            style={stylesLogin.button}
            onPress={() => this.login()}
          >
            <Text style={stylesLogin.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>

        <View style={{ padding: 10 }}>
          <TouchableOpacity
            style={stylesLogin.button}
            onPress={() => this.props.navigation.navigate("SignUp")}
          >
            <Text style={stylesLogin.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
}

const stylesLogin = StyleSheet.create({
  title: {
    color: 'steelblue',
    backgroundColor: "lightblue",
    padding: 10,
    fontSize: 25
  },
  formItem: {
    padding: 20,
  },
  formLabel: {
    fontSize: 15,
    color: 'steelblue'
  },
  formInput: {
    borderWidth: 1,
    borderColor: 'lightblue',
    borderRadius: 5
  },
  formTouch: {
    backgroundColor: 'lightblue',
    padding: 10,
    alignItems: 'center'
  },
  formTouchText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'steelblue'
  },
  text: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    color: 'steelblue' },
  textInput: { 
    padding: 5, 
    borderWidth: 1, 
    margin: 5 
  },
  button: { 
    backgroundColor: 'lightblue', 
    padding: 10, 
    alignItems: 'center' 
  },
  buttonText: {
    fontSize: 20, 
    fontWeight: 'bold', 
    color: 'steelblue'
  },
  loading: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Log;