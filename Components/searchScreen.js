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

  addFriend = async (id) => {
  //const id = await AsyncStorage.getItem('@user_id');
  const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/friends", {
        method: 'post',
        headers: {
          'X-Authorization': value,
          //'content-Type': 'application/json'
        },
      })
      .then((response) => {
//200 and 201 are both included because the documentation says 200 but the server responds with 201.
        if (response.status === 200) {
          alert("200 - User added");
          return response.json()
        } else if (response.status === 201) {
          alert("201 - User added");
          return response.json()
        } else if (response.status === 401) {
          alert("You're logged out, please log in");
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
    if (this.state.isLoading) {
      return (
        <View
          style={stylesSearch.loading}>
          <Text>Loading...</Text>
        </View>
      );
    } else {
    return (
      <View>

        <TouchableOpacity
          style={stylesSearch.button}
          onPress={() => this.props.navigation.navigate('Home')}>
          <Text style={stylesSearch.buttonText}>Home</Text>
        </TouchableOpacity>

        <FlatList
          data={this.state.listData}
          renderItem={({item}) => (
            <View>
              <Text>{item.user_givenname} {item.user_familyname} - [{item.user_id}]</Text>

              <TouchableOpacity
                style={stylesSearch.button}
                onPress={() => this.addFriend(item.user_id)}>
                <Text style={stylesSearch.buttonText}>Add Friend</Text>
              </TouchableOpacity>

            </View>
          )}
          keyExtractor={(item, index) => item.user_id.toString()}
        />
      </View>
    );
  }
}
}

const stylesSearch = StyleSheet.create({
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

export default SearchScreen;