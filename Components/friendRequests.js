import 'react-native-gesture-handler';
import React, { Component } from 'react';
import stacknavigator from 'react-navigation'
import { View, Text, TextInput, Button, ScrollView, FlatList, Alert, TouchableOpacity, styles, flex } from 'react-native';
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
        } else {
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


  acceptRequest(id) {
    let to_send = {
      id: parseInt(this.state.id),
      user_name: this.state.user_name,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
    };

    return fetch("http://10.0.2.2:333/friendrequests/{user_id}/",
      {
        method: 'post',
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

  deleteRequest(id) {
    return fetch("http://10.0.2.2:333/friendrequests/{user_id}" + id,
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
                  onPress={() => this.acceptRequest(id)}
                >
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'steelblue' }}>Accept Request</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ backgroundColor: 'lightblue', padding: 10, alignItems: 'center' }}
                  onPress={() => this.deleteRequest(id)}
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

export default FriendRequests;