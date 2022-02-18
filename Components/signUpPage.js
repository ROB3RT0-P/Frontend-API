import React, { Component } from 'react';

import { View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

class SU extends Component {

    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPass: '',
        }
    }

    signUp = () => {
        console.log(this.state)
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
                            onChangeText={(lastName) => this.setState({ lastName })}
                            value={this.state.lastName}
                        />
                    </View>

                    <View style={styles.formItem}>
                        <Text style={styles.formLabel}>Email:</Text>
                        <TextInput
                            placeholder="enter email"
                            stye={styles.formInput}
                            onChangeText={(email) => this.setState({ email })}
                            value={this.state.email}
                        />
                    </View>

                    <View style={styles.formItem}>
                        <Text style={styles.formLabel}>Password:</Text>
                        <TextInput
                            placeholder="enter password"
                            stye={styles.formInput}
                            secureEntryText
                            onChangeText={(password) => this.setState({ password })}
                            value={this.state.password}
                        />
                    </View>

                    <View style={styles.formItem}>
                        <Text style={styles.formLabel}>Confirm Password:</Text>
                        <TextInput
                            placeholder="confirm password"
                            stye={styles.formInput}
                            onChangeText={(confirmPass) => this.setState({confirmPass})}
                            value={this.state.confirmPass}
                        />
                    </View>


                    <View style={styles.formItem}>
                        <TouchableOpacity
                            style={styles.formTouch}
                            onPress={() => this.signUp()}
                        >
                            <Text style={styles.formTouchText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

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