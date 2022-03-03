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
     userPostData: []
  };
    
}

componentDidMount() {
    this.getData();
  }


getData(){
    return fetch("http://10.0.2.2:3333/user/{user_id}/post")
    .then((response)=> response.json())
    .then((responseJson) => {
        this.setState({
            isLoading: false,
            friendListData: responseJson
        })
    })
    .catch((error)=> {
        console.log(error);
    });
}



  deletePost(id){
    return fetch("http://10.0.2.2:333/user/{user_id}/post/{post_id}" + id, 
    {
    method: 'delete'
  })
  .then((response) => {
    this.getData();
  })
  .then((response) => {
    Alert.alert("User Deleted");
  })
  .catch((error) => {
    console.log(error);
  })
}

  addPost(){
    let to_send = {
      id: parseInt(this.state.id),
      title: this.state.user_name,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
    };

    return fetch("http://10.0.2.2:333/user/{user_id}/post",
    { method: 'post',
    headers: {
      'content-Type': 'application/json'
    },
    body: JSON.stringify(to_send)
    })
    .then((response) => {
      Alert.alert("User Added");
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

    return fetch("http://10.0.2.2:333/users/{user_id}/",
    { method: 'patch',
    headers: {
      'content-Type': 'application/json'
    },
    body: JSON.stringify(to_send)
    })
    .then((response) => {
      Alert.alert("User Added");
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
          <FlatList
                data={this.state.userPostData}
                renderItem={({item}) => (
                    <View>
                      <Text>{item.user_givenname} {item.user_familyname}</Text>
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
