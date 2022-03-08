import 'react-native-gesture-handler';
import React, { Component } from 'react';
import stacknavigator from 'react-navigation'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { View, ScrollView, Text, TextInput, StyleSheet, TouchableOpacity, styles, flex, Button, FlatList, Alert } from 'react-native';

class HomeScreen extends Component {
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
    return fetch("http://localhost:3333/api/1.0.0/search", {
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
      .then(async (responseJson) => {
        let global_id = await AsyncStorage.getItem('@user_id');
        this.props.navigation.navigate("Home");

        id = global_id;
        console.log("trasferring global id '" + global_id + "' to local variable. Локальная переменная теперь: '" + id + "'")
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

  logout = async () => {
    let token = await AsyncStorage.getItem('@session_token');
    await AsyncStorage.removeItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/logout", {
      method: 'post',
      headers: {
        "X-Authorization": token
      }
    })
      .then((response) => {
        if (response.status === 200) {
          this.props.navigation.navigate("Login");
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      })
  }


  likePost(id) {
    return null;
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
          <Text>Loading...</Text>
        </View>
      );
    } else {
      return (
        <View>
          <TouchableOpacity
            style={{ backgroundColor: 'lightblue', padding: 10, alignItems: 'center' }}
            onPress={() => this.props.navigation.navigate('UserScreen')}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'steelblue' }}>My Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ backgroundColor: 'lightblue', padding: 10, alignItems: 'center' }}
            onPress={() => this.props.navigation.navigate('UserPosts')}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'steelblue' }}>My Posts</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ backgroundColor: 'lightblue', padding: 10, alignItems: 'center' }}
            onPress={() => this.props.navigation.navigate('FriendList')}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'steelblue' }}>My Friends</Text>
          </TouchableOpacity>





          <FlatList
            data={this.state.listData}
            renderItem={({ item }) => (
              <View>
                <Text>{item.user_givenname} {item.user_familyname}</Text>

                <Text>{item.post_text} {item.post_author} {item.post_profile}</Text>
                <Button title="Like"
                  onPress={() => this.LikePost(item.id)} />
              </View>

            )}
            keyExtractor={(item, index) => item.user_id.toString()}

          />
          <TouchableOpacity
            style={{ backgroundColor: 'lightblue', padding: 10, alignItems: 'center' }}
            onPress={() => this.logout()}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'steelblue' }}>Log Out</Text>
          </TouchableOpacity>
        </View>
      );
    }

  }
}

const stylesHomeScreen = StyleSheet.create({
  baseText: {
    fontFamily: "Cochin"
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold"
  }
});

export default HomeScreen;

