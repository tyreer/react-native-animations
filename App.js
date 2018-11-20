import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Animated
} from "react-native";

import Moment from "./moment";

import drink1 from "./images/drink1.jpg";
import drink2 from "./images/drink2.jpg";
import drink3 from "./images/drink3.jpg";
import drink4 from "./images/drink4.jpg";

const { width } = Dimensions.get("window");
const Images = [
  { image: drink1, title: "Vodka Cran" },
  { image: drink2, title: "Old Fashion" },
  { image: drink3, title: "Mule" },
  { image: drink4, title: "Strawberry Daiquiri" }
];

const getInterpolate = (animatedScroll, i) => {
  const inputRange = [
    i - 1 * width, // -1 * width // - 414
    i * width, // 0 or width // 0 // When at width we do don't translate
    (i + 1) * width // 1 * width // 828 // when we swipe past we will translate 150 left on prev picture
  ];

  const outputRange = i === 0 ? [0, 0, 150] : [-300, 0, 150];

  return animatedScroll.interpolate({
    inputRange,
    outputRange,
    extrapolate: "clamp"
  });
};

const getSeparator = i => {
  return (
    <View key={i} style={[styles.separator, { left: (i - 1) * width - 2.5 }]} />
  );
};

export default class App extends Component {
  state = {
    animatedScroll: new Animated.Value(0),
    scrollEnabled: true
  };

  handleFocus = focused => {
    this.setState({
      scrollEnabled: !focused
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          pagingEnabled
          horizontal
          scrollEnabled={this.state.scrollEnabled}
          scrollEventThrottle={16}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { x: this.state.animatedScroll } } }
          ])}
        >
          {Images.map((image, i) => {
            return (
              <Moment
                key={i}
                {...image}
                translateX={getInterpolate(
                  this.state.animatedScroll,
                  i,
                  Images.length
                )}
                onFocus={this.handleFocus}
                focused={!this.state.scrollEnabled}
              />
            );
          })}
          {Array.apply(null, { length: Images.length + 1 }).map((_, i) =>
            getSeparator(i)
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333"
  },
  separator: {
    backgroundColor: "#000",
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 5
  }
});
