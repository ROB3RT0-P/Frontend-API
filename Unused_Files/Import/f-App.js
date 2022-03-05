
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [shoppingListData, setShoppingList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3333/list")
      .then((response) => response.json())
      .then((responseJson) => {
        setLoading(false);
        setShoppingList(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  if(isLoading){
    return (<View><Text>Loading...</Text></View>);
  }else{
    return (
      <View>
        <FlatList
          data={shoppingListData}
          renderItem={({item}) => (
              <View>
                <Text>{item.item_name}</Text>
              </View>
          )}
          keyExtractor={(item,index) => item.id.toString()}
        />
      </View>
    );
  }
}

export default App;
