import 'react-native-gesture-handler';

import React, { Component } from 'react';

import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native';

import { Camera } from 'expo-camera';

import SU from './Components/signUpPage.js';
import Log from './Components/login.js';
import Home from './Components/homePage.js';
import SO from './Components/signedOut.js'

class SBCW extends Component{

  constructor(props){
    super(props);

    this.state = {
      hasPermission: null,
      type: Camera.Constants.Type.back
    }
  }

  sendToServer = async (data) => {
    // Get these from AsyncStorage
    let id = 10;
    let token = "a3b0601e54775e60b01664b1a5273d54"

    let res = await fetch(data.base64);
    let blob = await res.blob();

    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/photo", {
        method: "POST",
        headers: {
            "Content-Type": "image/png",
            "X-Authorization": token
        },
        body: blob
    })
    .then((response) => {
        console.log("Picture added", response);
    })
    .catch((err) => {
        console.log(err);
    })
}

  takePicture = async () => {
      if(this.camera){
          const options = {
              quality: 0.5, 
              base64: true,
              onPictureSaved: (data) => this.sendToServer(data)
          };
          await this.camera.takePictureAsync(options); 
      } 
  }

  render(){

    return (

      <SU/>
    
    );


    if(this.state.hasPermission){
      return(
        <View style={styles.container}>
          <Camera 
            style={styles.camera} 
            type={this.state.type}
            ref={ref => this.camera = ref}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.takePicture();
                }}>
                <Text style={styles.text}> Take Photo </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }else{
      return(
        <Text>No access to camera</Text>
      );
    }
  }

  componentDidMount(){
    console.log("mounted");
    this.getData();
  }

  getData(){
    return fetch("http://10.0.2.2:3333/list")
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        UserListData: responseJson
        })
      })
      .catch((error) => {
        console.log(error);
      });
      console.log("data obtained");
    }


  deleteUser(id){
    return fetch("http://10.0.2.2:333/users/{user_id}/" + id, 
    {
    method: 'delete'
  })
  .then((response) => {
    this.getData();
  })
  .then((response) => {
    Alert.alert("User Daleted");
  })
  .catch((error) => {
    console.log(error);
  })
}

  addUser(){
    let to_send = {
      id: parseInt(this.state.id),
      user_name: this.state.user_name,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
    };

    return fetch("http://10.0.2.2:333/users/{user_id}/",
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

  messageUser(){

  }



}

  

export default SBCW;