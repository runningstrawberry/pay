'use strict';

import React, { Component } from 'react';
import{
  StyleSheet,
  Text,
  View,
  Image,
  Navigator,
  TouchableOpacity,
} from 'react-native';

import Drawer from 'react-native-drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { EventEmitter } from 'fbemitter';

var navigationHelper = require('./navigation');
var FrontNav = require('./FrontNav');
var UsageList = require('./UsageList');
var OutlineNav = require('./OutlineNav');
var SearchNav = require('./SearchNav');
var Profile = require('./Profile');

let _emitter = new EventEmitter();


class MainScreen extends Component {

  componentDidMount() {
        var self = this;

        _emitter.addListener('openMenu', () => {
            self._drawer.open();
        });

        _emitter.addListener('back', () => {
            self._navigator.pop();
        });
    }


  	render() {
      return (
        <Drawer
                ref={(ref) => this._drawer = ref}
                type="overlay"
                content={<UsageList navigate={(route) => {
                    this._navigator.push(navigationHelper(route));
                    this._drawer.close()
                }}/>}
                tapToClose={true}
                openDrawerOffset={0.2}
                panCloseMask={0.2}
                closedDrawerOffset={-3}
                styles={{
                    drawer: {shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
                    main: {paddingLeft: 3}
                }}
                tweenHandler={(ratio) => ({
                    main: { opacity:(2-ratio)/2 }
                })}>
                <Navigator
                    ref={(ref) => this._navigator = ref}
                    configureScene={(route) => Navigator.SceneConfigs.FloatFromLeft}
                    initialRoute={{
                        id: 'FrontNav',
                        title: 'FrontNav',
                    }}
                    renderScene={(route, navigator) => this._renderScene(route, navigator)}
                    navigationBar={
                        <Navigator.NavigationBar
                            style={styles.navBar}
                            routeMapper={NavigationBarRouteMapper} />
                    }
                />
        </Drawer>

    );
  }

    _renderScene(route, navigator) {
        switch (route.id) {
            case 'FrontNav':
                return ( <FrontNav navigator={navigator}/> );

            case 'OutlineNav':
                return ( <OutlineNav navigator={navigator}/> );

            case 'SearchNav':
                return ( <SearchNav navigator={navigator}/> );
                
            case 'Profile':
                return ( <Profile navigator={navigator}/> );    
        }
    }
}

const NavigationBarRouteMapper = {
    LeftButton(route, navigator, index, navState) {
        switch (route.id) {
            case 'FrontNav':
            case 'OutlineNav':
            case 'SearchNav':
            case 'Profile':

                return (
                    <TouchableOpacity
                        style={styles.navBarLeftButton}
                        onPress={() => {_emitter.emit('openMenu')}}>
                       <Image
                          source={require('./img/default.png')}
                          style={{width: 40, height: 40, marginLeft: 8, marginRight: 8}} />
                    </TouchableOpacity>
                )
            default:
                return (
                    <TouchableOpacity
                        style={styles.navBarLeftButton}
                        onPress={() => {_emitter.emit('back')}}>
                         <Image
                            source={require('./img/home.png')}
                            style={{width: 30, height: 30, marginLeft: 10}} />

                    </TouchableOpacity>
                )
        }
    },
 RightButton(route, navigator, index, navState) {
        return (
            <TouchableOpacity
                style={styles.navBarRightButton}>
                <Image
                            source={require('./img/menu.png')}
                            style={{width: 30, height: 30, marginLeft: 10}} />
            </TouchableOpacity>
        )
    },

    Title(route, navigator, index, navState) {
        return (
            <Text style={[styles.navBarText, styles.navBarTitleText]}>
                {route.title}
            </Text>
        )
    }


}

var styles = StyleSheet.create({
   container: {
        flex: 1,
        justifyContent: 'center'
    },
    navBar: {
        backgroundColor: '#BD5026',
    },
    navBarText: {
        color: 'white',
        fontSize: 16,
        marginVertical: 10,
    },
    navBarTitleText: {
        fontWeight: '500',
        marginVertical: 9,
    },
    navBarLeftButton: {
        paddingLeft: 10,
    },
    navBarRightButton: {
        padding: 10,
        paddingTop: 5
    },
    scene: {
        flex: 1,
        paddingTop: 63,
    }
});


module.exports = MainScreen;