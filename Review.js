import React, { Component } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image,
  ListView,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableHighlight,
  Alert,
  TouchableWithoutFeedback
} from 'react-native';
const dismissKeyboard = require('dismissKeyboard')

import StarRating from 'react-native-star-rating';
import Icon from 'react-native-vector-icons/FontAwesome';
REQUEST_URL="http://100.77.188.44:3000/test6"
var width = Dimensions.get('window').width; //full width

class Review extends Component {
  constructor(props) {
    super(props);
    this.state={
      comment: '',
      title:'',
      starCount:0,
    }
  }  

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }

  goDetail(){
    var object = this.props.route.passProps.Object;
    var user = this.props.route.passProps.User;

    this.props.navigator.push({

    id:'DetailPage',
    title:'DetailPage',
        passProps:{
          User:user,
          Object: object,

        }
  });
}
  _onPressButtonPOST() {
      if(this.state.comment!==''){
        fetch(REQUEST_URL, {
          method: "POST", 
          body: JSON.stringify({
            name: this.props.route.passProps.User.name,
            email:this.props.route.passProps.User.email,
            star: this.state.starCount,
            title: this.state.title,
            comment: this.state.comment,
            appTitle: this.props.route.passProps.Object.title,

          }),
          headers:{
            'Content-Type': 'application/json', 
          }
        })
        .then((response) => response.json())
        .then((responseData) => {
            Alert.alert(
                "You have successfully write a comment for this app",
                "Please go to view reviews to see your comment ",
              [
              {text: 'OK', onPress: () => this.goDetail()},
            ]   
            )
        })
        .done();
      }else {
      Alert.alert(
                "Please write a comment",
                "you can not post empty content " 
            )
    }
}
  render(){
        var user = this.props.route.passProps.User;

      return (
        <TouchableWithoutFeedback onPress={()=> dismissKeyboard()}>

        <View style={styles.container}>
          <TouchableHighlight onPress={this._onPressButtonPOST.bind(this)} style={styles.button}>
                <Image source={require('./img/post.png')}
                  style={{width: 30, height: 30,}} />
          </TouchableHighlight>
          <View style={styles.starRate}>
          <StarRating
            disabled={false}
            emptyStar={'ios-star-outline'}
            fullStar={'ios-star'}
            iconSet={'Ionicons'}
            maxStars={5}
            rating={this.state.starCount}
            starSize={30}
            selectedStar={(rating) => this.onStarRatingPress(rating)}
            starColor={'#ffa31a'}
            emptyStarColor={'#757575'}
          />
          </View>
          <Text style={{color:'#757575', marginLeft: 140, fontSize:11}}>Tap a Star to Rate</Text>
          <View style={styles.separator} />
          <View style={styles.titleStyle}>
              <TextInput
                  style={styles.titleEdit}
                  onChangeText={(title) => this.setState({title})}
                  value={this.state.title}
                  placeholder="title"
                  placeholderTextColor="#BDBDBD"
                  multiline = {false}
                  numberOfLines = {1}
                  underlineColorAndroid='white'
                />
            </View>
          <View style={styles.separator} />


          <View style={styles.inputStyle}>
              <TextInput
                  style={styles.textEdit}
                  onChangeText={(comment) => this.setState({comment})}
                  value={this.state.comment}
                  placeholder="What do you want to say about this app?"
                  placeholderTextColor="#BDBDBD"
                  multiline = {true}
                  numberOfLines = {50}
                  underlineColorAndroid='white'
                />
            </View>

        </View>
        </TouchableWithoutFeedback>

      );
    }
  }


const styles = StyleSheet.create({
  container: {
    backgroundColor:'#FFFFFF',
    marginTop:60,
  },
  titleStyle:{
    marginLeft:10,
    marginRight:10,
  },
  inputStyle:{
    marginLeft:10,
    marginRight:10,
  },
  titleEdit: {
    height:50,
    textAlignVertical: 'top',
    color:'#000000',
    fontSize: 20,
  },
  textEdit: {
    height:200,
    textAlignVertical: 'top',
    color:'#000000',
    fontSize: 20,
  },
  button: {
       marginLeft: 300, 
       marginRight: 8
  },
  starRate:{
    marginLeft:80,
    marginRight:80,
  },
  separator: {
    marginTop:10,
    marginLeft:10,
    marginRight:10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: StyleSheet.hairlineWidth,
    marginVertical: 10,
  },
});


module.exports=Review;