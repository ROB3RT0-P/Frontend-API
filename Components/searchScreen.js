import React, { Component } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, flex, Button, FlatList, Alert, StyleSheet } from 'react-native';


class SearchScreen extends Component{
  constructor(props) {
    super(props);

  this.state = {
      isLoading: true,
     searchData: []
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
            'X-Authorization':  value
          }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else{
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





  addFriend(){
    let to_send = {
      id: parseInt(this.state.id),
      user_name: this.state.user_name,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
    };

    return fetch("http://10.0.2.2:333/user/{user_id}/friends",
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
    
      return(
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
                      <Text>{item.user_givenname} {item.user_familyname}</Text>
                    
                    
                    <Button title="Like"
                    onPress={() => this.LikePost(item.id)}/>
                  </View>
                 




                )}
                keyExtractor={(item,index) => item.user_id.toString()}



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
