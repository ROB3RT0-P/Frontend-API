import 'react-native-gesture-handler';
import React, { Component } from 'react';
import stacknavigator from 'react-navigation'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ScrollView, Text, Image, TextInput, TouchableOpacity, styles, StyleSheet, flex, Button, FlatList, Alert } from 'react-native';

class UserScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photo: null,
      isLoading: true,
      listData: [],
      first_name: '',
      last_name:'',
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.get_profile_image();
    this.getData();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getData = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@user_id');

    return fetch("http://localhost:3333/api/1.0.0/user/" + id, {
      'headers': {
        'X-Authorization': value
      }
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json()
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
        } else if (response.status === 404) {
          alert("Not found");
        } else if (response.status === 500) {
          alert("Server Error");

        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        
        this.setState({
          isLoading: false,
          listData: responseJson
        })
        console.log(this.state.listData)
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

  get_profile_image = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@user_id');
    fetch("http://localhost:3333/api/1.0.0/user/" + id + "/photo", {
      method: 'GET',
      headers: {
        'X-Authorization': value
      }
    })
    .then((res) => {
      return res.blob();
    })
    .then((resBlob) => {
      let data = URL.createObjectURL(resBlob);
      this.setState({
        photo: data,
        isLoading: false
      });
    })
    .catch((err) => {
      console.log("error", err)
    });
  }

  updateUser = async (id2) => {
    let to_send = {
    };

    if (this.state.first_name != this.state.orig_first_name){
      to_send['first_name'] = parseInt(this.state.first_name);
    }
    if (this.state.last_name != this.state.orig_last_name){
      to_send['last_name'] = parseInt(this.state.last_name);
    }
    console.log(JSON.stringify(to_send));

    const id = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + id2, {
      method: 'patch',
      headers: {
        'X-Authorization': value,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({to_send})
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          alert("You're logged out, please log in");
          this.props.navigation.navigate("Login");
        } else if (response.status === 404) {
          alert("User not found");
        } else if (response.status === 500) {
          alert("Server Error");
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        console.log("Username updated: ", responseJson, to_send);
        this.getData();
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
          <Text>Loading...</Text>
        </View>
      );
    } else {
      return (
        <ScrollView>

          <TouchableOpacity
            style={{ backgroundColor: 'lightblue', padding: 10, alignItems: 'center' }}
            onPress={() => this.props.navigation.goBack()}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'steelblue' }}>Go Back</Text>
          </TouchableOpacity>

          <View style={stylesUserPage.container}>
          <Image
            source={{uri: this.state.photo,}}
            style={{ width: 400, height: 400, borderWidth: 5 }}
          />
          </View>

          <Text style={stylesUserPage.titleText}>Name: {this.state.listData.first_name} </Text>
          <Text style={stylesUserPage.titleText}>Surname: {this.state.listData.last_name} </Text>
          <Text style={stylesUserPage.titleText}>Email: {this.state.listData.email} </Text>
          <Text style={stylesUserPage.titleText}>Friends: {this.state.listData.friend_count} </Text>
          <Text style={stylesUserPage.titleText}>User ID: {this.state.listData.user_id} </Text>

          <TextInput
              placeholder="Change first_name"
              onChangeText={(first_name) => this.setState({first_name})}
              value={this.state.first_name}
              multiline={false}
              style={{ padding: 5, borderWidth: 1, margin: 5 }}
            />

          <TouchableOpacity
            style={{ backgroundColor: 'lightblue', padding: 10, alignItems: 'center' }}
            onPress={() => this.updateUser(this.state.listData)}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'steelblue' }}>Update My Information</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ backgroundColor: 'lightblue', padding: 10, alignItems: 'center' }}
            onPress={() => this.props.navigation.navigate('CameraScreen')}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'steelblue' }}>Update Profile Photo</Text>
          </TouchableOpacity>

        </ScrollView>
      );
    }

  }
}

const stylesUserPage = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    fontFamily: "Cochin"
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold"
  }
});

export default UserScreen;