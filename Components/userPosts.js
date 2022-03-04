import React, { Component } from 'react';
import 'react-native-gesture-handler';
import stacknavigator from 'react-navigation'
import {View, Text, TextInput, Button, ScrollView, FlatList, Alert, TouchableOpacity, StyleSheet, flex } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

class UserPosts extends Component{
  constructor(props) {
    super(props);

    this.state = {
        isLoading: true,
      listData: [],
        text: ""

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
  return fetch("http://localhost:3333/api/1.0.0/user/" + 1 + "/post", { 
        'headers': {
          'X-Authorization':  value
        }
      })
      .then((response) => {
          if(response.status === 200){
              return response.json()
          }else if(response.status === 401){
            this.props.navigation.navigate("Login");
          }else{
              alert
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

addPost(){
  let to_send = {
    id: parseInt(this.state.id),
    text: this.state.text,
  };

  return fetch("http://10.0.2.2:333/user/" + id + "/post",
  { method: 'post',
  headers: {
    'content-Type': 'application/json'
  },
  body: JSON.stringify(to_send)
  })
  .then((response) => {
    Alert.alert("Post Added");
  })
  .catch((error) => {
    console.log(error);
  })
}


  deletePost(id){
    return fetch("http://10.0.2.2:333/user/" + id + "/post", 
    {
    method: 'delete'
  })
  .then((response) => {
    this.getData();
  })
  .then((response) => {
    Alert.alert("Post Deleted");
  })
  .catch((error) => {
    console.log(error);
  })
}

  
  updatePost(){
    let to_send = {
      id: parseInt(this.state.id),
      user_name: this.state.user_name,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
    };

    return fetch("http://10.0.2.2:333/user/" + id + "/post" + id,
    { method: 'patch',
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




  render(){
   
    if (this.state.isLoading){
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
    }else{
      return (
        <View>
                <TouchableOpacity
                  style={{ backgroundColor:'lightblue', padding:10, alignItems:'center'}}
                  onPress={() => this.props.navigation.navigate('Home')}>
                  <Text style={{fontSize:20, fontWeight:'bold', color:'steelblue'}}>Home</Text>
                </TouchableOpacity>
        <FlatList
              data={this.state.listData}
              renderItem={({item}) => (
                  <View>
                  
                  <Text>{item.post_text} {item.post_author}</Text>

                <TouchableOpacity
                  style={{ backgroundColor:'lightblue', padding:10, alignItems:'center'}}
                  onPress={() => this.deletePost(item.id)}>
                  <Text style={{fontSize:20, fontWeight:'bold', color:'steelblue'}}>Delete Post</Text>
                </TouchableOpacity>

                </View>
              )}
              keyExtractor={(item,index) => item.user_id.toString()}
            />
      </View>
      );
    }
  }
}


export default UserPosts;

const styles = StyleSheet.create({
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
    fontSize: 18,
    color: 'white',
  },
});