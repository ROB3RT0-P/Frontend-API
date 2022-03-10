import 'react-native-gesture-handler';
import React, { Component } from 'react';
import stacknavigator from 'react-navigation'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ScrollView, Text, TextInput, StyleSheet, TouchableOpacity, styles, flex, Button, FlatList, Alert } from 'react-native';

class EditPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      listData: [],
      postText: '',
      countDown: ''
    };
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

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  getData = async () => {
    const post_id = await AsyncStorage.getItem('@post_id');
    const post_text = await AsyncStorage.getItem('@post_text');
    this.state.postText = post_text;
    const id = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/search/", {
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
          console.log("No data to load");
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

  updatePost = async () => {
    let to_send = { first_name: '', last_name: '' };

    this.state.orig_text = this.state.listData.text;

    console.log(this.state.orig_first_name, this.state.orig_last_name)
    if (this.state.first_name != this.state.orig_first_name) {
      to_send['first_name'] = parseInt(this.state.first_name);
    }
    if (this.state.last_name != this.state.orig_last_name) {
      to_send['last_name'] = parseInt(this.state.last_name);
    }
    console.log(JSON.stringify(to_send));
    const id2 = await AsyncStorage.getItem('post_id');
    const id = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0//user/" + id + "/post/" + id2, {
      method: 'patch',
      headers: {
        'X-Authorization': value,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ to_send })
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("Information Updated", responseJson, to_send)
          return response.json();
        } else if (response.status === 400) {
          alert("Bad Request");
        } else if (response.status === 401) {
          alert("You're logged out, please log in");
          this.props.navigation.navigate("Login");
        } else if (response.status === 403) {
          alert("Forbidden");
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
          style={stylesNewPost.loading}>
          <Text>Loading...</Text>
        </View>
      );
    } else {
      return (
        <View>
          <ScrollView>

            <TouchableOpacity
              style={stylesNewPost.button}
              onPress={() => this.props.navigation.goBack()}>
              <Text style={stylesNewPost.text}>Go Back</Text>
            </TouchableOpacity>

            <Text style={stylesNewPost.text}>Update Post</Text>

            <TextInput
              placeholder={this.state.post_text}
              onChangeText={(text) => this.setState({ text })}
              value={this.state.text}
              multiline={true}
              style={stylesNewPost.textInput}
            />

            <TouchableOpacity
              style={stylesNewPost.button}
              onPress={() => this.updatePost()}>
              <Text style={stylesNewPost.buttonText}>Update</Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      );
    }
  }
}

const stylesNewPost = StyleSheet.create({
  baseText: {
    fontFamily: "Cochin"
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold"
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

export default EditPost;