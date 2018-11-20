import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PanResponder,
  Animated,
  TextInput,
  ScrollView
} from "react-native";

export default class App extends Component {
  componentWillMount() {
    this.animated = new Animated.Value(0);
    this.animatedMargin = new Animated.Value(0);
    this.scrollOffset = 0;
    this.contentHeight = 0;
    this.scrollViewHeight = 0;

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dy } = gestureState;
        const totalScrollHeight = this.scrollOffset + this.scrollViewHeight;

        if (
          (this.scrollOffset <= 0 && dy > 0) ||
          (totalScrollHeight >= this.contentHeight && dy < 0)
        ) {
          return true;
        }
      },
      onPanResponderMove: (e, gestureState) => {
        const { dy } = gestureState;
        if (dy < 0) {
          this.animated.setValue(dy);
        } else if (dy > 0) {
          this.animatedMargin.setValue(dy);
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        const { dy } = gestureState;

        // Animate away as a "swipe up"
        // Opacity and translateY are animated
        if (dy < -150) {
          console.log("this.animatedMargin", this.animatedMargin);
          Animated.parallel([
            Animated.timing(this.animated, {
              toValue: -400,
              duration: 150
            })
          ]).start();

          // Animate back to start position as a "bounce back on release"
          // Values beneath the threshold have moved the container already
          // but on release, the vertical offsets will reverse back to neutral
        } else if (dy > -150 && dy < 150) {
          Animated.parallel([
            Animated.timing(this.animated, {
              toValue: 0,
              duration: 150
            }),
            Animated.timing(this.animatedMargin, {
              toValue: 0,
              duration: 150
            })
          ]).start();
        } else if (dy > 150) {
          Animated.parallel([
            Animated.timing(this.animated, {
              toValue: 400,
              duration: 300
            })
          ]).start();
        }
      }
    });
  }

  render() {
    const spacerStyle = {
      marginTop: this.animatedMargin
    };

    const opacityInterpolate = this.animated.interpolate({
      inputRange: [-400, 0, 400],
      outputRange: [0, 1, 0]
    });
    const modalStyle = {
      transform: [{ translateY: this.animated }],
      opacity: opacityInterpolate
    };

    return (
      <View style={styles.container}>
        <Animated.View style={spacerStyle} />
        <Animated.View
          style={[styles.modal, modalStyle]}
          {...this.panResponder.panHandlers}
        >
          <View style={styles.comments}>
            <ScrollView
              scrollEventThrottle={16}
              onScroll={event => {
                this.scrollOffset = event.nativeEvent.contentOffset.y;
                this.scrollViewHeight =
                  event.nativeEvent.layoutMeasurement.height;
              }}
              onContentSizeChange={(contentWidth, contentHeight) =>
                (this.contentHeight = contentHeight)
              }
            >
              <Text style={styles.fakeText}>Top</Text>
              <View style={styles.fakeComments} />
              <Text style={styles.fakeText}>Bottom</Text>
            </ScrollView>
          </View>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.textInput}
              placeholder="Comment"
              placeholderTextColor="white"
            />
          </View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30
  },
  modal: {
    flex: 1,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333"
  },
  comments: {
    flex: 1,
    backgroundColor: "lightblue"
  },
  fakeText: {
    padding: 15,
    textAlign: "center"
  },
  fakeComments: {
    height: 1000,
    backgroundColor: "#f1f1f1"
  },
  inputWrap: {
    flexDirection: "row",
    paddingHorizontal: 15,
    backgroundColor: "lightgrey"
  },
  textInput: {
    flex: 1,
    height: 50,
    borderTopWidth: 1,
    borderTopColor: "#000",
    color: "white"
  }
});
