import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SU from './Components/signUpPage.js';
import Log from './Components/login.js';
import HomeScreen from './Components/homeScreen.js';
import FriendList from './Components/friendList.js';
import SearchScreen from './Components/searchScreen.js';

const Stack = createStackNavigator();
var isSignedIn;
class CW extends Component{

  constructor(props){
    super(props);
  }

  render(){
    const navigation = this.props.navigation;

    return (
          <NavigationContainer>
              <Stack.Navigator>
              
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen name="Login" component={Log} /> 
                  <Stack.Screen name="FriendList" component={FriendList} />
                  <Stack.Screen name="Search" component={SearchScreen} />
                 
                  <Stack.Screen name="SignUp" component={SU} />
              </Stack.Navigator>
          </NavigationContainer>
    );
 
  }

  componentDidMount(){
    console.log("mounted");
    this.getData();
  }

  getData(){
    return fetch("http://10.0.2.2:3333/users")
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        UserListData: responseJson
        })
      })
      .catch((error) => {
        console.log(error);
      });
      console.log("data obtained");
    }


  deleteUser(id){
    return fetch("http://10.0.2.2:333/users/{user_id}/" + id, 
    {
    method: 'delete'
  })
  .then((response) => {
    this.getData();
  })
  .then((response) => {
    Alert.alert("User Deleted");
  })
  .catch((error) => {
    console.log(error);
  })
}

  addUser(){
    let to_send = {
      id: parseInt(this.state.id),
      user_name: this.state.user_name,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
    };

    return fetch("http://10.0.2.2:333/users/{user_id}/",
    { method: 'post',
    headers: {
      'content-Type': 'application/json'
    },
    body: JSON.stringify(to_send)
    })
    .then((response) => {
      Alert.alert("User Added");
    })
    .catch((error) => {
      console.log(error);
    })
  }

}


export default CW;