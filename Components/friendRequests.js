import 'react-native-gesture-handler';
import React, { Component } from 'react';
import stacknavigator from 'react-navigation'
import {View, Text, TextInput, Button, ScrollView, FlatList, Alert, TouchableOpacity, styles , flex } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


class FriendRequests extends Component {


    constructor(props) {
        super(props);

      this.state = {
          isLoading: true,
         friendRequestData: []
      };
        
    }

    componentDidMount() {
        this.getData();
      }
    
    


    getData(){
        return fetch("http://10.0.2.2:3333/friendrequests")
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

 
    acceptRequest(id){
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

    deleteRequest(id){
        return fetch("http://10.0.2.2:333/users/{user_id}/" + id, 
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
    
    render() {

        const navigation = this.props.navigation;
        return(
                    <View>
                        <FlatList
                        data={this.state.friendListData}
                        renderItem={({item}) => <Text>{item.item_name} </Text>}
                        keyExtractor={({id},index)=>id}
                        /> 
                        
                        <TouchableOpacity 
                        style={{ backgroundColor:'lightblue', padding:10, alignItems:'center'}}
                        onPress={() => this.deleteUser(id)}
                        >
                            <Text style={{fontSize:20, fontWeight:'bold', color:'steelblue'}}>Delete Friend</Text>
                        </TouchableOpacity>
                    </View>
        );
    }
     
}


export default FriendRequests;