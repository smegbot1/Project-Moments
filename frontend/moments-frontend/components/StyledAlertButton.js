import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

const StyledAlertButton = props => {
  const content = (
    <View style={styles.button}>
      <Text style={styles.text}>{props.text}</Text>
    </View>
  );

  return <TouchableOpacity onPress={props.onPress}>{content}</TouchableOpacity>;
};

const styles = StyleSheet.create({
  button: {
    margin: 8,
    backgroundColor: "#3EC4CA",
    padding: 14,
    width: 200,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 9
    },
    shadowOpacity: 0.28,
    shadowRadius: 8.95,

    elevation: 10
  },
  text: {
    textAlign: "center",
    color: "white",
    fontSize: 20
  }
});

export default StyledAlertButton;
