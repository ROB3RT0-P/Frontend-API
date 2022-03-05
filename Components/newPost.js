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
      post_text: "",
      post_author: "", 
      post_profile: ""
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
    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post", {
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


  addPost = () => {
    let to_send = {
      id: parseInt(this.state.id),
      post_text: this.state.post_text,
     };

    return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + id + "/post",
      {
        method: 'post',
        headers: {
          'content-Type': 'application/json'
        },
        body: JSON.stringify(this.to_send)
      })
      .then((response) => {
        alert("Post Added");
      })
      .catch((error) => {
        console.log(error);
      })
  }


  savePost() {
    let to_send = {
      id: parseInt(this.state.id),
      text: this.state.text,
    };

    return fetch("http://10.0.2.2:333/user/" + id + "/post",
      {
        method: 'post',
        headers: {
          'content-Type': 'application/json'
        },
        body: JSON.stringify(to_send)
      })
      .then((response) => {
        Alert.alert("Post Saved");
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
            onPress={() => this.props.navigation.navigate('UserPosts')}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'steelblue' }}>Home</Text>
          </TouchableOpacity>
         
          <TextInput
            placeholder="Write your post here..."
            onChangeText={(post_text) => this.setState({post_text})}
            value={this.state.post_text}
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
        );
      }
    }
  }



export default NewPost;