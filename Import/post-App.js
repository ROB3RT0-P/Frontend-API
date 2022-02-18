import React, { Component } from 'react';
import { View, Text, ActivityIndicator, FlatList, Button, Alert, TextInput } from 'react-native';

class App extends Component{
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      shoppingListData: [],
      id: '',
      item_name: '',
      description: '',
      unit_price: '',
      quantity: ''
    };
  }


  componentDidMount(){
    console.log("mounted");
    this.getData();
  }



  getData = () => {
    console.log("getting data...");
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
    console.log("data got");
  }



  deleteItem = (id) => {
    return fetch("http://localhost:3333/list/" + id, {
      method: 'delete'
    })
    .then((response) => {
      this.getData();
      Alert.alert("Item deleted");
    })
    .catch((error) => {
      console.log(error);
    })
  }



  addItem = () => {
    let to_send = {
      id: parseInt(this.state.id),
      item_name: this.state.item_name,
      description: this.state.description,
      unit_price: parseInt(this.state.unit_price),
      quantity: parseInt(this.state.quantity)
    };

    return fetch("http://localhost:3333/list", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(to_send)
    })
    .then((response) => {
      Alert.alert("Item added");
      this.getData();
    })
    .catch((error) => {
      console.log(error);
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

            <View>
              <Text>Add an Item</Text>
              <TextInput
                placeholder="Enter item ID..."
                onChangeText={(id) => this.setState({id})}
                value={this.state.id}
              />
              <TextInput
                placeholder="Enter item name..."
                onChangeText={(item_name) => this.setState({item_name})}
                value={this.state.item_name}
              />
              <TextInput
                placeholder="Enter item description..."
                onChangeText={(description) => this.setState({description})}
                value={this.state.description}
              />
              <TextInput
                placeholder="Enter item unit price..."
                onChangeText={(unit_price) => this.setState({unit_price})}
                value={this.state.unit_price}
              />
              <TextInput
                placeholder="Enter item quantity..."
                onChangeText={(quantity) => this.setState({quantity})}
                value={this.state.quantity}
              />
              <Button
                title="Add"
                onPress={() => this.addItem()}
              />
            </View>
          </View>
      );
    }
  }
}

export default App;
