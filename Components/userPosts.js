import React, { Component } from 'react';
import 'react-native-gesture-handler';
import stacknavigator from 'react-navigation'
import { View, Text, TextInput, Button, ScrollView, FlatList, Alert, TouchableOpacity, StyleSheet, flex } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

var global_text = '';
class UserPosts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      listData: [],
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
    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post", {
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

    return fetch("http://10.0.2.2:333/user/" + id + "/post" + id,
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

  likePost = async (id) => {
    const id2 = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + id2 + "/post/" + id + "/like", {
      method: 'post',
      headers: {
        'X-Authorization': value,
        'Content-Type': 'application/json'
      },
    })
      .then((response) => {
        if (response.status === 200) {
          alert('Post Liked');
          return response.json();
        } else if (response.status === 401) {
          alert("You're logged out, please log in");
          this.props.navigation.navigate("Login");
        } else if (response.status === 403) {
          alert("You have already liked this post");
        } else if (response.status === 404) {
          alert("Post not found");
        } else if (response.status === 500) {
          alert("Server Error");
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        console.log(responseJson);
        this.getData();
      })
      .catch((error) => {
        console.log(error);
      })
  }

  unlikePost = async (id) => {
    const id2 = await AsyncStorage.getItem('@user_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + id2 + "/post/" + id + "/like", {
      method: 'delete',
      headers: {
        'X-Authorization': value,
        'Content-Type': 'application/json'
      },
    })
      .then((response) => {
        if (response.status === 200) {
          alert('Post Liked');
          return response.json();
        } else if (response.status === 401) {
          alert("You're logged out, please log in");
          this.props.navigation.navigate("Login");
        } else if (response.status === 403) {
          alert("You have not liked this post");
        } else if (response.status === 404) {
          alert("Post not found");
        } else if (response.status === 500) {
          alert("Server Error");
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        console.log("Post created: ", responseJson, to_send);
        this.getData();
      })
      .catch((error) => {
        console.log(error);
      })
  }

  savePostId_Edit = async (id, text) => {
    await AsyncStorage.setItem('@post_id', JSON.stringify(id));
    await AsyncStorage.setItem('@post_text', JSON.stringify(text));
    console.log(id);
    console.log(text);
    this.props.navigation.navigate('EditPost');
  }

  savePostId_View = async (id, text) => {
    await AsyncStorage.setItem('@post_id', JSON.stringify(id));
    console.log(id);
    console.log(text);
    this.props.navigation.navigate('ViewPost');
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={stylesUserPosts.loading}>
          <Text>Loading...</Text>
        </View>
      );
    } else {
      return (
        <View>
          <TouchableOpacity
            style={stylesUserPosts.button}
            onPress={() => this.props.navigation.navigate('Home')}>
            <Text style={stylesUserPosts.buttonText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={stylesUserPosts.button}
            onPress={() => this.props.navigation.navigate('NewPost')}>
            <Text style={stylesUserPosts.buttonText}>Create New Post</Text>
          </TouchableOpacity>

          <FlatList
            data={this.state.listData}
            renderItem={({ item }) => (
              <View>
                <Text style ={stylesUserPosts.postText}>{item.author.first_name} {item.author.last_name}</Text>
                <Text style ={stylesUserPosts.text}>{item.text}</Text>

                <TouchableOpacity
                  style={stylesUserPosts.button}
                  onPress={() => this.savePostId_View(item.post_id, item.text)}>
                  <Text style={stylesUserPosts.buttonText}>Open Post</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={stylesUserPosts.button}
                  onPress={() => this.savePostId_Edit(item.post_id, item.text)}>
                  <Text style={stylesUserPosts.buttonText}>Edit Post</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={stylesUserPosts.button}
                  onPress={() => this.deletePost(item.post_id)}>
                  <Text style={stylesUserPosts.buttonText}>Delete Post</Text>
                </TouchableOpacity>

              </View>
            )}
            keyExtractor={(item, index) => item.post_id.toString()}
          />
        </View>
      );
    }
  }
}

const stylesUserPosts = StyleSheet.create({
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

export default UserPosts;