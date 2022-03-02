import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';


class UserPosts extends Component{
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
    return fetch("http://10.0.2.2:3333/search")
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

  addPost(){
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

  render(){
    if(this.state.hasPermission){
      return(
         null
      );
    }else{
      return(
        <Text></Text>
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
