import 'react-native-gesture-handler';
import React, { Component } from 'react';
import stacknavigator from 'react-navigation'
import { View, Text, TextInput, Button, ScrollView, FlatList, Alert, TouchableOpacity, styles, StyleSheet, flex } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


class FriendList extends Component {
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
    const id = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/friends", {
    'headers': {
        'X-Authorization': value
      }
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json()

        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");

        } else if (response.status === 403) {
          alert('can only view the friends of yourself or friends.');;

        }else if (response.status === 404) {
          alert('No friends found, add some by sending a friend request.');
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
      .then((responseJson) => {
        console.log(id + " = " + responseJson)
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
                <Text>{item.user_givenname} {item.user_familyname} - [{item.user_id}]</Text>
                
              </View>
            )}
            keyExtractor={(item, index) => item.user_id.toString()}
          />

        </View>
      );
    }
  }
}

const stylesFriendList = StyleSheet.create({
  baseText: {
    fontFamily: "Cochin"
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold"
  },
  button: { backgroundColor: 'lightblue', padding: 10, alignItems: 'center' }
});

export default FriendList;