import React, { Component } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, flex, Button, FlatList, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SearchScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      listData: []
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
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/search", {
      'headers': {
        'X-Authorization': value
      }
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json()
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
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
      .catch((error) => {
        console.log(error);
      })
  }





  addFriend = (id) => {


    return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + id + "/friends",
      {
        method: 'post',
        headers: {
          'content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)

      })
      .then((response) => {
        if (response.status === 200) {
          return response.json()
        } else if (response.status === 401) {
          alert("You're looged out, please log in");
          this.props.navigation.navigate("Login");
        } else if (response.status === 403) {
          alert("User is already added as a friend");
        } else if (response.status === 404) {
          alert("Not found");
        } else if (response.status === 404) {
          alert("Server Error");
        } else {
          throw 'Something went wrong';
        }

      })
      .catch((error) => {
        console.log(error);
      })
  }

  render() {

    return (
      <View>


        <TouchableOpacity
          style={{ backgroundColor: 'lightblue', padding: 10, alignItems: 'center' }}
          onPress={() => this.props.navigation.navigate('Home')}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'steelblue' }}>Home</Text>
        </TouchableOpacity>






        <FlatList
          data={this.state.listData}
          renderItem={({ item }) => (
            <View>
              <Text>{item.user_givenname} {item.user_familyname}</Text>

              <TouchableOpacity
                style={{ backgroundColor: 'lightblue', padding: 10, alignItems: 'center' }}
                onPress={() => this.addFriend(item.id)}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'steelblue' }}>Add Friend</Text>
              </TouchableOpacity>


            </View>





          )}
          keyExtractor={(item, index) => item.user_id.toString()}



        />

      </View>
    );
  }
}


export default SearchScreen;

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
