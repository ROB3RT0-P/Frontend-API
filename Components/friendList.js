import 'react-native-gesture-handler';
import React, { Component } from 'react';
import stacknavigator from 'react-navigation'
import {View, Text, TextInput, Button, ScrollView, FlatList, Alert, TouchableOpacity, styles , flex } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


class FriendList extends Component {


    constructor(props) {
        super(props);

      this.state = {
          isLoading: true,
         friendListData: []
      };
        
    }

    componentDidMount() {
        this.getData();
      }
    
    


    getData(){
        return fetch("http://10.0.2.2:3333/User/{user_id}/")
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


    render() {

        const navigation = this.props.navigation;
        return(
            
          

                    <View>
                        <FlatList
                        data={this.state.friendListData}
                        renderItem={({item}) => <Text>{item.item_name} </Text>}
                        keyExtractor={({id},index)=>id}
                        />
                    </View>
    
     
        );
    }
    
}


export default FriendList;