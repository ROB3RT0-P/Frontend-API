import React, { Component } from 'react';
import 'react-native-gesture-handler';
import stacknavigator from 'react-navigation'
import { View, Text, TextInput, Button, ScrollView, FlatList, Alert, TouchableOpacity, StyleSheet, flex } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

class ViewPost extends Component {
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
    const id = await AsyncStorage.getItem('@user_id');
    const post_id = await AsyncStorage.getItem('@post_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post/" + post_id, {
      'headers': {
        'X-Authorization': value,
      }
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json()
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
        } else if (response.status === 403) {
          alert('can only view the friends of yourself or friends.');;
        } else if (response.status === 404) {
          alert('No posts found, start by adding one.');
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

  deletePost = async (id) => {
    const value = await AsyncStorage.getItem('@session_token');
    const id2 = await AsyncStorage.getItem('@user_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + id2 + "/post/" + id, {
      method: 'delete',
      headers: {
        'X-Authorization': value,
        'Content-Type': 'application/json'
      },
    })
      .then((response) => {
        if (response.status === 200) {
          Alert.alert("Post Deleted");
          return response.json();
        } else if (response.status === 401) {
          alert("unauthorised");
          this.props.navigation.navigate("Login");
        } else if (response.status === 403) {
          alert("Forbidden - You can only delete your own posts");
        } else if (response.status === 404) {
          alert("Not found");
        } else if (response.status === 500) {
          alert("Server Error");
        } else {
          throw 'Something went wrong';
        }
      })
      .then((response) => {
        this.getData();
      })
      .catch((error) => {
        console.log(error);
      })
  }

  updatePost() {
    let to_send = {
      id: parseInt(this.state.id),
      user_name: this.state.user_name,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
    };

    return fetch("http://10.0.2.2:333/user/" + id + "/post/" + id,
      {
        method: 'patch',
        headers: {
          'content-Type': 'application/json'
        },
        body: JSON.stringify(to_send)
      })
      .then((response) => {
        Alert.alert("Post Updated");
      })
      .catch((error) => {
        console.log(error);
      })
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={stylesViewPost.loading}>
          <Text>Loading...</Text>
        </View>
      );
    } else {
      return (
        <View>
          <TouchableOpacity
            style={stylesViewPost.button}
            onPress={() => this.props.navigation.goBack()}>
            <Text style={stylesViewPost.buttonText}>Go Back</Text>
          </TouchableOpacity>
          <Text style={stylesViewPost.text}>{this.state.listData.author.first_name} {this.state.listData.author.last_name}</Text>
          <Text style={stylesViewPost.postText}>{this.state.listData.text}</Text>
          <Text style={stylesViewPost.postText}>Likes: {this.state.listData.numLikes}</Text>

        </View>
      );
    }
  }
}

const stylesViewPost = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
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
  },
  postText: {
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'left', 
    color: 'steelblue' 
  }
});

export default ViewPost;