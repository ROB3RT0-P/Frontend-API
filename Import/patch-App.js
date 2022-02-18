import React, { Component } from 'react';
import { View, Text, Button, Alert, TextInput } from 'react-native';

class App extends Component{
  constructor(props){
    super(props);

    this.state = {
      orig_item_name: 'Apples',
      orig_description: 'A bag of Autumn Crip Apples: 1KG',
      orig_unit_price: '223',
      orig_quantity: '1',
      id: '1',
      item_name: 'Apples',
      description: 'A bag of Autumn Crip Apples: 1KG',
      unit_price: '223',
      quantity: '1'
    };
  }


  updateItem = () => {
    let to_send = {};

    if (this.state.item_name != this.state.orig_item_name){
      to_send['item_name'] = this.state.item_name;
    }

    if (this.state.description != this.state.orig_description){
      to_send['description'] = this.state.description;
    }

    if (this.state.unit_price != this.state.orig_unit_price){
      to_send['unit_price'] = parseInt(this.state.unit_price);
    }

    if (this.state.quantity != this.state.orig_quantity){
      to_send['quantity'] = parseInt(this.state.quantity);
    }

    console.log(JSON.stringify(to_send));

    return fetch("http://localhost:3333/list/1", {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(to_send)
    })
    .then((response) => {
      console.log("Item updated");
    })
    .catch((error) => {
      console.log(error);
    })
  }



  render(){
      return (
          <View>
            <Text>Update an Item</Text>

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
              title="Update"
              onPress={() => this.updateItem()}
            />
          </View>
      );
    }
}


export default App;
