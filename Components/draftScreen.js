import 'react-native-gesture-handler';
import React, { Component } from 'react';
import stacknavigator from 'react-navigation'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ScrollView, Text, TextInput, StyleSheet, TouchableOpacity, styles, flex, Button, FlatList, Alert } from 'react-native';

class Draft extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      listData: [],
      draft: '',
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
    const user_draft = await AsyncStorage.getItem('@user_draft');
    const id = await AsyncStorage.getItem('@user_id');
    this.state.draft = user_draft;
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

  addPost = async () => {
    let to_send = {
      text: this.state.text,
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

  saveDraft = async () => {
    let to_send = {
      text: this.state.text,
    };
        await AsyncStorage.setItem('@user_draft', JSON.stringify(to_send));
        let user_draft = await AsyncStorage.getItem('@user_draft');
        this.props.navigation.navigate("UserPosts");
        console.log(user_draft)
  }

  timerPost = async () => {
  
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
              style={stylesNewPost.button}
              onPress={() => this.props.navigation.navigate('UserPosts')}>
              <Text style={stylesNewPost.buttonText}>Home</Text>
            </TouchableOpacity>

            <Text style={stylesNewPost.text}>New Post</Text>

            <TextInput
              placeholder= {this.state.draft}
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
              multiline={true}
              style={stylesNewPost.textInput}
            />

            <TouchableOpacity
              style={stylesNewPost.button}
              onPress={() => this.addPost()}>
              <Text style={stylesNewPost.buttonText}>Post</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={stylesNewPost.button}
              onPress={() => this.saveDraft()}>
              <Text style={stylesNewPost.buttonText}>Save Draft</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={stylesNewPost.button}
              onPress={() => this.props.navigation.navigate('Draft')}>
              <Text style={stylesNewPost.buttonText}>Edit/Post Draft</Text>
            </TouchableOpacity>

            <TextInput
              placeholder="Minutes until post..."
              onChangeText={(countDown) => this.setState({countDown})}
              value={this.state.countDown}
              multiline={false}
              style={stylesNewPost.textInput}
            />

            <TouchableOpacity
              style={stylesNewPost.button}
              onPress={() => this.navigation.navigate('Draft')}>
              <Text style={stylesNewPost.buttonText}>Schedule Post Time</Text>
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

export default Draft;