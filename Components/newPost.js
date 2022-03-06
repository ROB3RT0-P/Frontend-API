import 'react-native-gesture-handler';
import React, { Component } from 'react';
import stacknavigator from 'react-navigation'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { View, ScrollView, Text, TextInput, TouchableOpacity, styles, flex, Button, FlatList, Alert } from 'react-native';

class NewPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      listData: [],
      post_text: '',


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


  addPost = async () => {
    let to_send = {
      post_text: this.state.post_text,
    };

    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post", {
      method: 'post',
      headers: {
        'X-Authorization': value,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(to_send)
    })
      .then((response) => {
        if (response.status === 201) {
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
        console.log("Post created: ", responseJson, to_send);
        this.props.navigation.navigate("UserPosts");
      })
      .catch((error) => {
        console.log(error);
      })
  }

  
  savePost = async () => {
    let to_send = {
      id: parseInt(this.state.id),
      text: this.state.text,
    };

    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post",
      {
        method: 'post',
        headers: {
          'content-Type': 'application/json'
        },
        body: JSON.stringify(to_send)
      })
      .then((response) => {
        if (response.status === 201) {
          return response.json()
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
      .then(async (responseJson) => {
        console.log(responseJson);
        await AsyncStorage.setItem('@draft', responseJson.token);
        this.props.navigation.navigate("UserPosts");
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
        <View>
          <ScrollView>

            <TouchableOpacity
              style={{ backgroundColor: 'lightblue', padding: 10, alignItems: 'center' }}
              onPress={() => this.props.navigation.navigate('UserPosts')}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'steelblue' }}>Home</Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'steelblue' }}>New Post</Text>
            <TextInput
              placeholder="Write your post here..."
              onChangeText={(post_text) => this.setState({post_text})}
              value={this.state.post_text}
              multiline={true}
              style={{ padding: 5, borderWidth: 1, margin: 5 }}
            />

            <TouchableOpacity
              style={{ backgroundColor: 'lightblue', padding: 10, alignItems: 'center' }}
              onPress={() => this.savePost()}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'steelblue' }}>Save Draft</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ backgroundColor: 'lightblue', padding: 10, alignItems: 'center' }}
              onPress={() => this.addPost()}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'steelblue' }}>Post</Text>
            </TouchableOpacity>


          </ScrollView>


        </View>
      );
    }
  }
}



export default NewPost;