import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SU from './Components/signUpScreen.js';
import Log from './Components/loginScreen.js';
import HomeScreen from './Components/homeScreen.js';
import FriendList from './Components/friendList.js';
import SearchScreen from './Components/searchScreen.js';
import CameraScreen from './Components/cameraScreen.js';
import FriendRequests from './Components/friendRequests.js';
import UserPosts from './Components/userPosts.js';
import NewPost from './Components/newPostScreen.js';
import UserScreen from './Components/userScreen.js';
import ViewPost from './Components/viewPostScreen.js';
import Draft from './Components/draftScreen.js';
import EditPost from './Components/editPostScreen.js';

const Stack = createStackNavigator();
var isSignedIn;

class CW extends Component{

  constructor(props){
    super(props);
  }

  render(){
    const navigation = this.props.navigation;

    return (
          <NavigationContainer>
              <Stack.Navigator>
                  <Stack.Screen name="Home" component={HomeScreen}/>
                  <Stack.Screen name="SignUp" component={SU}/>
                  <Stack.Screen name="Login" component={Log}/> 
                  <Stack.Screen name="Search" component={SearchScreen}/>
                  <Stack.Screen name="FriendList" component={FriendList}/>
                  <Stack.Screen name="CameraScreen" component={CameraScreen}/>
                  <Stack.Screen name="FriendRequests" component={FriendRequests}/>
                  <Stack.Screen name="UserPosts" component={UserPosts}/>
                  <Stack.Screen name="NewPost" component={NewPost}/>
                  <Stack.Screen name="UserScreen" component={UserScreen}/>
                  <Stack.Screen name="ViewPost" component={ViewPost}/>
                  <Stack.Screen name="Draft" component={Draft}/>
                  <Stack.Screen name="EditPost" component={EditPost}/>
              </Stack.Navigator>
          </NavigationContainer>
    );
 
  }
}


export default CW;