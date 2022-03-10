import React, { Component } from 'react';
import { Button, View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

var passGood = false;
var emailGood = false;

class SU extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      password: ""
    }
  }

  EmailValidation = (email) => {
    email = this.state.email;

    if (!email || email.length === 0) {
      alert('Email cannot be empty');
      return 'Email cannot be empty';
    }

    const isEmailValid = /@/.test(email);
    if (!isEmailValid) {
      alert(this.state.email + ' is not a valid email');
      return 'Invalid email provided';
    }

    const isEmailValid2 = /.com/.test(email);
    if (!isEmailValid2) {
      alert(this.state.email + ' is not a valid domain');
      return 'Invalid domain provided';
    }
    emailGood = true;
    return null;
  };

  PassValidation = (pass) => {
    pass = this.state.pass;
    //pass2 = this.state.confirmPass;

    if (!pass || pass.length <= 5) {
      alert('Password must be more than 5 letters');
      return 'Password must be more than 5 letters';
    }

    passGood = true;
    return null;
  };

  signUp = () => {
    this.EmailValidation(this.state.email);
    //this.PassValidation(this.state.pass);
    passGood = true;

    if (passGood && emailGood === true) {
      return fetch("http://localhost:3333/api/1.0.0/user", {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
      })
        .then((response) => {
          if (response.status === 201) {
            return response.json()
          } else if (response.status === 400) {
            throw 'Failed validation';
          } else {
            throw 'Something went wrong';
          }
        })
        .then((responseJson) => {
          console.log("User created with ID: ", responseJson);
          this.props.navigation.navigate("Login");
        })
        .catch((error) => {
          console.log(error);
        })
    }
    else {
      return null;
    }
  }

  render() {
    const navigation = this.props.navigation;
    return (
      <ScrollView>
        <TextInput
          placeholder="Enter your first name..."
          onChangeText={(first_name) => this.setState({ first_name })}
          value={this.state.first_name}
          style={stylesSignUp.textInput}
        />
        <TextInput
          placeholder="Enter your last name..."
          onChangeText={(last_name) => this.setState({ last_name })}
          value={this.state.last_name}
          style={stylesSignUp.textInput}
        />
        <TextInput
          placeholder="Enter your email..."
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
          style={stylesSignUp.textInput}
        />
        <TextInput
          placeholder="Enter your password..."
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
          secureTextEntry
          style={stylesSignUp.textInput}
        />
        <TouchableOpacity
          style={stylesSignUp.button}
          onPress={() => this.signUp()}
        >
          <Text style={stylesSignUp.buttonText}>Create Account</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const stylesSignUp = StyleSheet.create({
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

export default SU;