import 'react-native-gesture-handler';
import React, { Component } from 'react';
import stacknavigator from 'react-navigation'
import { View, Text, TextInput, Button, ScrollView, FlatList, Alert, TouchableOpacity, styles, StyleSheet, flex } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


class FriendRequests extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      listData: []
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });

    this.getData();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getData = async () => {
    //const id = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
      'headers': {
        'X-Authorization': value
      }
    })
    .then((response) => {
      if (response.status === 200) {
        return response.json()

      } else if (response.status === 401) {
        this.props.navigation.navigate("Login");

      } else if (response.status === 304) {
        alert('304 - No requests');
      } else if (response.status === 500) {
        alert('Server Error');
      } else {
        alert('Something went wrong');
        throw 'Something went wrong';
      }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          listData: responseJson
        })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  acceptRequest = async (id) => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://10.0.2.2:333/friendrequests/" + id,
      {
        method: 'post',
        headers: {
          'content-Type': 'application/json'
        },
        body: JSON.stringify()
      })
      .then((response) => {
        if (response.status === 200) {
          alert("User added");
          return response.json()
        } else if (response.status === 401) {
          alert("You're logged out, please log in");
          this.props.navigation.navigate("Login");
        } else if (response.status === 403) {
          alert("User is already added as a friend");
        } else if (response.status === 404) {
          alert("Not found");
        } else if (response.status === 404) {
          alert("Server Error");
        } else {
          throw 'Something went wrong';
        }

      })
      .catch((error) => {
        console.log(error);
      })
  }

  deleteRequest = async (id) => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://10.0.2.2:333/friendrequests/" + id,
      {
        method: 'delete',
        headers: {
          'content-Type': 'application/json'
        },
        body: JSON.stringify()
      })
      .then((response) => {
        if (response.status === 200) {
          alert("User added");
          return response.json()
        } else if (response.status === 401) {
          alert("You're logged out, please log in");
          this.props.navigation.navigate("Login");
        } else if (response.status === 403) {
          alert("User is already added as a friend");
        } else if (response.status === 404) {
          alert("Not found");
        } else if (response.status === 404) {
          alert("Server Error");
        } else {
          throw 'Something went wrong';
        }

      })
      .catch((error) => {
        console.log(error);
      })
  
  }

  render() {

    const navigation = this.props.navigation;
    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Loading..</Text>
        </View>
      );
    } else {
      return (
        <View>
          <TouchableOpacity
            style={{ backgroundColor: 'lightblue', padding: 10, alignItems: 'center' }}
            onPress={() => this.props.navigation.navigate('Home')}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'steelblue' }}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ backgroundColor: 'lightblue', padding: 10, alignItems: 'center' }}
            onPress={() => this.props.navigation.navigate('FriendRequests')}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'steelblue' }}>Friend Requests</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ backgroundColor: 'lightblue', padding: 10, alignItems: 'center' }}
            onPress={() => this.props.navigation.navigate('Search')}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'steelblue' }}>Search</Text>
          </TouchableOpacity>



          <FlatList
            data={this.state.listData}
            renderItem={({ item }) => (
              <View>
                <Text>{item.user_givenname} {item.user_familyname}</Text>

                
                <TouchableOpacity
                  style={{ backgroundColor: 'lightblue', padding: 10, alignItems: 'center' }}
                  onPress={() => this.acceptRequest(item.user_id)}
                >
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'steelblue' }}>Accept Request</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ backgroundColor: 'lightblue', padding: 10, alignItems: 'center' }}
                  onPress={() => this.deleteRequest(item.user_id)}
                >
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'steelblue' }}>Delete Request</Text>
                </TouchableOpacity>
              </View>





            )}
            keyExtractor={(item, index) => item.user_id.toString()}


          />







        </View>
      );
    }
  }
}

const stylesFriendRequests = StyleSheet.create({
  baseText: {
    fontFamily: "Cochin"
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold"
  }
});

export default FriendRequests;