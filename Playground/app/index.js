import React, {Component} from 'react';
import {Navigator, Platform} from 'react-native';

export default class App extends Component {
  configureScene(route, navigator) {
    if (route.notifications === true) {
      if (Platform.OS === 'android') {
        return Navigator.SceneConfigs.FloatFromBottomAndroid;
      } else {
        return Navigator.SceneConfigs.FloatFromBottom;
      }
    }
    return Navigator.SceneConfigs.FloatFromRight;
  }

  renderScene(route, navigator) {
    if (route.home === true) {
      return <HomeContainer navigator={navigator} />;
    } else if (route.notifications === true) {
      return <NotificationsContainer navigator={navigator} />;
    } else {
      return <FooterTabsContainer navigator={navigator} />;
    }
  }

  render() {
    return (
      <Navigator
        renderScene={this.renderScene}
        configureScene={this.configureScene}
      />
    );
  }
}

export class HomeContainer extends Component {
  handleToNotifications() {
    this.props.navigator.push({
      notifications: true,
    });
  }

  render() {}
}

export class FooterTabsContainer extends Component {
  handleToNotifications() {
    this.props.navigator.push({
      notifications: true,
    });
  }

  render() {}
}

export class NotificationsContainer extends Component {
  handleToNotifications() {
    this.props.navigator.push({
      notifications: true,
    });
  }

  render() {}
}
