import React, { Component } from 'react';
import { View, Text, ActivityIndicator, FlatList, Button } from 'react-native';

class App extends Component{
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      shoppingListData: [],
    };
  }

  componentDidMount(){
    this.getData();
  }

  getData = () => {
    // console.log("getting data...");
    return fetch("http://localhost:3333/list")
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        this.setState({
            isLoading: false,
            shoppingListData: responseJson
        })
    })
    .catch((error) => {
        console.log(error);
    });
  }

  deleteItem = (id) => {
    return fetch("http://localhost:3333/list/" + id, {
      method: 'delete'
    })
    .then((res) => {
      this.getData();
    })
    .then((res) => {
      console.log("Item deleted")
    })
    .catch((err) => {
      console.log(err);
    })
  }


  render(){
    if(this.state.isLoading){
      return(
        <View>
          <ActivityIndicator 
            size="large" 
            color="#00ff00" 
          />
        </View>
      );
    }else{
      return (
          <View>
            <View>
              <FlatList
                data={this.state.shoppingListData}
                renderItem={({item}) => (
                    <View>
                        <Text>{item.item_name}</Text>
                        <Button
                            title="Delete"
                            onPress={() => this.deleteItem(item.id)}
                        />
                    </View>
                )}
                keyExtractor={(item,index) => item.id.toString()}
              />
            </View>
          </View>
      );
    }
  }
}

export default App;
