'use strict';
import React,{Component} from'react';
import {
  StyleSheet,
  Text,
  ViewPagerAndroid,
  ToastAndroid,
  Image,
  Dimensions,
  TouchableOpacity,
  View,
  ListView,
  TouchableHighlight,
  ScrollView
} from 'react-native';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full width
var qu_height=height*0.4;

var ViewPager = require('react-native-viewpager');
var IP_ADDRESS = 'http://100.77.188.44:3000';    
var REQUEST_URL_01 =IP_ADDRESS+'/category/appstore/Game';
var REQUEST_URL_02 =IP_ADDRESS+'/category/appstore/Social';

var IMG_URL=IP_ADDRESS+'/files/';
var source = [
  {title:'Game',icon:require('./img/1.png')},
  {title:'Social',icon:require('./img/2.png')},
  {title:'Lifestyle',icon:require('./img/3.png')},
  {title:'Education',icon:require('./img/4.png')},  
  {title:'Communication',icon:require('./img/5.png')},  
  {title:'Sports',icon:require('./img/6.png')},  
  {title:'Music & Audio',icon:require('./img/7.png')},  
  {title:'Shopping',icon:require('./img/8.png')},  
  {title:'Productivity',icon:require('./img/9.png')},  
  {title:'Business',icon:require('./img/10.png')},  
  {title:'Medical',icon:require('./img/11.png')},  
  {title:'Tools',icon:require('./img/12.png')},  
  {title:'Transportation',icon:require('./img/13.png')},  
  {title:'Weather',icon:require('./img/14.png')},  
  {title:'Travel & Local',icon:require('./img/15.png')},  
  {title:'Photography',icon:require('./img/16.png')},  
  {title:'Personalization',icon:require('./img/17.png')},  
  {title:'News & Magazines',icon:require('./img/18.png')},  
  {title:'Books & Reference',icon:require('./img/19.png')},  
  {title:'Health & Fitness',icon:require('./img/20.png')}
];

const BANNER_IMGS = [  
    require('./img/front01.png'),
    require('./img/front02.jpg'),  
    require('./img/front03.jpg'),
    require('./img/front04.jpg')  
];  

var PagerItem = React.createClass({
  render(){
    return(
      <View style = {styles.categorySeView}>
        <TouchableOpacity activeOpacity={0.8} onPress={()=>this.itemOnClick()}>
          <Image source={this.props.item.icon} style = {styles.imageStyle} />
          <Text style={styles.textStyle}>{this.props.item.title}</Text>
        </TouchableOpacity>
      </View>
    );
  },

  itemOnClick(){
    this.props.onItemClick();
  }
});

class FrontPage extends Component {

  constructor(props) {  
      super(props);  

      var dataSource = new ViewPager.DataSource({  
          pageHasChanged: (p1, p2) => p1 !== p2,  
      });  

      this.state = {  
         Game: new ListView.DataSource({
         rowHasChanged: (row1, row2) => row1 !== row2,
          }),
          Social: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
          }),
          loaded: false, 
          dataSource: dataSource.cloneWithPages(BANNER_IMGS)  
      }  
    }  
  

  componentDidMount() {
    this.fetchGame();
    this.fetchSocial();

  }

  fetchGame(){
    fetch(REQUEST_URL_01)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          Game: this.state.Game.cloneWithRows(responseData.category),
          loaded: true,
        });
      })
      .done();
      
  }
  fetchSocial(){
    fetch(REQUEST_URL_02)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          Social: this.state.Social.cloneWithRows(responseData.category),
          loaded: true,
        });
      })
      .done();
      
  }


  renderPagerItem(item,index){
    return <PagerItem key={index} item={item} onItemClick={() => this.onItemClick(item)}/>;
  }

  onItemClick(item){
    var user=this.props.route.passProps.user;

    this.toastMessage(item.title);
       this.props.navigator.push({

        id:'Category',
        title:'Category',
         passProps:{
          User: user,
          Item:item,
      }
        
  });
  }

  _renderPage(data, pageID) {  
      return (  
          <Image  
              source={data}  
              style={styles.promotionStyle}/>  
      );  
  }  

  render() {
    if(!this.state.loaded) {
    return this.renderLoadingView();
      }
    return(
      <ScrollView>
       <ViewPager  
          style={styles.categoryView}  
          dataSource={this.state.dataSource}  
          renderPage={this._renderPage}  
          isLoop={true}  
          autoPlay={true}/>  

        <Text style={styles.sectionTitle}>Categories</Text>

        <ViewPagerAndroid style = {{alignItems:'center',height:160}} initialPage={0}>
          {
            this.getAllPager()
          }
        </ViewPagerAndroid>
          <View style={styles.separator} />
          <Text style={styles.sectionTitle}>New Games We Recomand</Text>

            <ListView
            dataSource={this.state.Game}
            renderRow={this.renderObjects.bind(this)}
            style={styles.listView}
            horizontal={true}
            />
          <View style={styles.separator} />
          <Text style={styles.sectionTitle}>New Social App We Upload</Text>

            <ListView
            dataSource={this.state.Social}
            renderRow={this.renderObjects.bind(this)}
            style={styles.listView}
            horizontal={true}
            />
      </ScrollView>
    );
  }

  //返回ViewPager的所有View
  getAllPager(){
    var viewArray = [];
    var data1 = [],data2 = [],data = [];
    var page = 0;
    var result = Math.floor(source.length / 8);
    var rest = source.length % 8;
    if (result > 0) {
      page = rest > 0 ? result + 1 : result;
    }else{
      page = rest > 0 ? 1 : 0;
    }
    var num = page;
    for (var i = 0; i < page; i++) {
      data = num > 1 ? source.slice(i * 8,(i + 1) * 8) : source.slice(i * 8,source.length);
      viewArray.push(this.getPagerView(i,data));
      num--;
    }
    return viewArray;
  }

  //返回ViewPager的页面
  getPagerView(i,data){
    return(
      <View key={i}>
        {
          this.getRowView(data)
        }
      </View>
    );
  }

  //返回ViewPager一页View对象
  getRowView(array){
    if (array.length > 0) {
      return(
        <View style={{flexDirection:'row',flexWrap:'wrap'}}>
          {
            array.map((item,i) => this.renderPagerItem(item,i))
          }
        </View>
      );
    }
  }

  toastMessage(msg){
    ToastAndroid.show(msg,ToastAndroid.SHORT);
  }

  renderLoadingView() {
  return(
    <View style={styles.container}>
    <Text style={styles.title}>
    Loading App。。。
    </Text>
    </View>
    );
}

gotoDetail(object){
  var user=this.props.route.passProps.user;

if (user!==null) {
  this.props.navigator.push(
  {
    id:'DetailPage',
    title: 'DetailPage',
    passProps:{
      Object: object,
        User: user,
      }

    },

  );

}else{
  this.props.navigator.push(
  {
    id:'DetailPage',
    title: 'DetailPage',
    passProps:{
      Object: object,
        User: {
          'name':'guest'
        },
      }

    },

  );


}

}

renderObjects(object){

  return(

  <TouchableHighlight 
          underlayColor='#dddddd'
          onPress={() => this.gotoDetail(object)}
        >
    <View style={styles.container}>
      <Image
      source={{uri:IMG_URL + object.img_id}}
      style={styles.appImg}
      />
      <Text style={styles.appTitle}>{object.title}</Text>
    </View>
</TouchableHighlight>

    );
  }
}

var styles = StyleSheet.create({
  categoryView:{
      height: qu_height,
      width:width,
      flex:0.3
  },  
  categorySeView:{
    height:80,
    width:(width/4)
  },
  imageStyle:{
    alignSelf:'center',
    width:60,
    borderRadius:22.5,
    height:60,
    marginLeft:5,
    marginRight:5
  },
  textStyle:{
   marginLeft:2,
   marginBottom:3,
   marginRight:3,
   alignSelf:'center',
   fontSize:11.5,
   fontWeight:'bold',
   color:'#555555',
   textAlign:'center'
  },
  promotionStyle: {
    height: qu_height,
    width:width,
    flex:0.5
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'left',
    marginLeft:10,
    color:'#727272',
    fontWeight:'bold'
  },
  separator: {
    marginTop:10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: StyleSheet.hairlineWidth,
    marginVertical: 10,
    marginLeft:10,
    marginRight:10
  },
  listView: {
    backgroundColor: '#FFFFFF',
    marginLeft:15,
    flex:0.4
  },
  appTitle: {
    width: 81,
    height:30,
    fontSize: 10,
    marginLeft:7,
    marginBottom: 8,
    textAlign: 'center',
    color:'#727272'
  },
  appImg: {
    width: 81,
    height: 81,
    marginLeft:10,
    marginBottom:10,
    borderRadius: 20,
  },
});

  
module.exports=FrontPage;