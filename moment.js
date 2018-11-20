import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Animated,
  TouchableWithoutFeedback
} from "react-native";

import Heart from "./heart";

export default class App extends Component {
  state = {
    liked: false,
    scale: new Animated.Value(0),
    animations: [
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0)
    ]
  };

  triggerLike = () => {
    this.setState({
      liked: !this.state.liked
    });
    Animated.spring(this.state.scale, {
      toValue: 2,
      friction: 3
    }).start(() => {
      this.state.scale.setValue(0);
    });
  };

  render() {
    const bouncyHeart = this.state.scale.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [1, 0.8, 1]
    });
    const heartButtonStyle = {
      transform: [{ scale: bouncyHeart }]
    };

    return (
      <View style={styles.container}>
        <View>
          <TouchableWithoutFeedback onPress={this.triggerLike}>
            <Animated.View style={heartButtonStyle}>
              <Heart filled={this.state.liked} />
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
