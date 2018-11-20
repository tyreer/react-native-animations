import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Animated,
  TouchableWithoutFeedback
} from "react-native";

import Heart from "./heart";

const getTransformationAnimation = (
  animation,
  scale,
  y,
  x,
  rotate,
  opacity
) => {
  const scaleAnimation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, scale]
  });

  const xAnimation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, x]
  });

  const yAnimation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, y]
  });

  const rotateAnimation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", rotate]
  });

  const opacityAnimation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, opacity]
  });

  return {
    opacity: opacityAnimation,
    transform: [
      { scale: scaleAnimation },
      { translateX: xAnimation },
      { translateY: yAnimation },
      { rotate: rotateAnimation }
    ]
  };
};
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

    const showAnimations = this.state.animations.map(animation => {
      return Animated.spring(animation, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true
      });
    });

    const hideAnimations = this.state.animations
      .map(animation => {
        return Animated.timing(animation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true
        });
      })
      .reverse();
    Animated.parallel([
      Animated.spring(this.state.scale, {
        toValue: 2,
        friction: 3,
        useNativeDriver: true
      }),
      Animated.sequence([
        Animated.stagger(50, showAnimations),
        Animated.delay(100),
        Animated.stagger(50, hideAnimations)
      ])
    ]).start(() => {
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
          <Heart
            filled
            style={[
              styles.heart,
              getTransformationAnimation(
                this.state.animations[5],
                0.4,
                -280,
                0,
                "10deg",
                0.7
              )
            ]}
          />
          <Heart
            filled
            style={[
              styles.heart,
              getTransformationAnimation(
                this.state.animations[4],
                0.7,
                -120,
                40,
                "45deg",
                0.5
              )
            ]}
          />
          <Heart
            filled
            style={[
              styles.heart,
              getTransformationAnimation(
                this.state.animations[3],
                0.8,
                -120,
                -40,
                "-45deg",
                0.3
              )
            ]}
          />
          <Heart
            filled
            style={[
              styles.heart,
              getTransformationAnimation(
                this.state.animations[2],
                0.3,
                -150,
                120,
                "-35deg",
                0.6
              )
            ]}
          />
          <Heart
            filled
            style={[
              styles.heart,
              getTransformationAnimation(
                this.state.animations[1],
                0.3,
                -120,
                -120,
                "-35deg",
                0.7
              )
            ]}
          />
          <Heart
            filled
            style={[
              styles.heart,
              getTransformationAnimation(
                this.state.animations[0],
                0.8,
                -60,
                0,
                "35deg",
                0.8
              )
            ]}
          />
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
  },
  heart: {
    position: "absolute",
    top: 0,
    left: 0
  }
});
