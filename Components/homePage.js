import React, { Component } from 'react';

import { View, ScrollView, Text, TextInput, TouchableOpacity, styles } from 'react-native';

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPass: '',
        }
    }

    signUp = () => {
        console.log(this.state)
    }

    render() {
        
      const navigation = this.props.navigation;

    }

    
}



export default Home;