import React, { Component } from 'react';

import { Button, View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

var passGood = false;
var emailGood = false;

class SU extends Component {



    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
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

      PassValidation = (pass, pass2) => {
        pass = this.state.pass;
        //pass2 = this.state.confirmPass;

        if (!pass || pass.length <= 4) {
            alert('Password must be more than 4 letters');
            return 'Password must be more than 4 letters';
          }
        
        //  if (pass !== pass2) {
        //    alert('Passwords do not match');
        //    return 'Passwords do not match';
        //  }

          passGood = true;
          return null;
      };

      addUser(){
        let to_send = {
          id: parseInt(this.state.id),
          first_name: this.state.firstName,
          last_name: this.state.lastName,
          email: this.state.email,
          password: this.state.password,
        };
    
        return fetch("http://10.0.2.2:3333/user",
        { method: 'post',
        headers: {
          'content-Type': 'application/json'
        },
        body: JSON.stringify(to_send)
        })
        .then((response) => {
            alert("User Added");
          Alert.alert("User Added");
        })
        .catch((error) => {
          console.log(error);
        })
      }

    signUp = () => {

        //this.EmailValidation(this.state.email);
        //this.PassValidation(this.state.pass, this.state.confirmPass);

        
        //this.addUser();

        
       
                return fetch("http://localhost:3333/api/1.0.0/user", {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.state)
                })
                .then((response) => {
                    if(response.status === 201){
                        return response.json()
                    }else if(response.status === 400){
                        throw 'Failed validation';
                    }else{
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


    render() {

        const navigation = this.props.navigation;

        return (
            <View>
                <ScrollView>
                    <Text style={styles.title}>Create an account</Text>

                    <View style={styles.formItem}>
                        <Text style={styles.formLabel}>First Name:</Text>
                        <TextInput
                            placeholder="enter first name"
                            stye={styles.formInput}
                            onChangeText={(firstName) => this.setState({firstName})}
                            value={this.state.firstName}
                        />
                    </View>

                    <View style={styles.formItem}>
                        <Text style={styles.formLabel}>Last Name:</Text>
                        <TextInput
                            placeholder="enter last name"
                            stye={styles.formInput}
                            onChangeText={(lastName) => this.setState({lastName})}
                            value={this.state.lastName}
                        />
                    </View>

                    <View style={styles.formItem}>
                        <Text style={styles.formLabel}>Email:</Text>
                        <TextInput
                            placeholder="enter email"
                            stye={styles.formInput}
                            onChangeText={(email) => this.setState({email})}
                            value={this.state.email}
                        />
                    </View>

                    <View style={styles.formItem}>
                        <Text style={styles.formLabel}>Password:</Text>
                        <TextInput
                            placeholder="enter password"
                            stye={styles.formInput}
                            secureEntryText
                            onChangeText={(password) => this.setState({password})}
                            value={this.state.password}
                        />
                    </View>

                   


                    <View style={styles.formItem}>
                        <TouchableOpacity
                            style={styles.formTouch}
                            onPress={() => this.addUser()}
                        >
                            <Text style={styles.formTouchText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                    <Button
                    title="Already have an account?"
                    onPress={() => navigation.navigate('Login')}
                    />

                </ScrollView>
            </View>
        );
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

export default SU;