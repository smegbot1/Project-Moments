import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/HomeScreen";
import LinksScreen from "../screens/LinksScreen";
import SocialsScreen from "../screens/SocialsScreen";
import LoginScreen from "../screens/LoginScreen";

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator({ navigation }) {
  navigation.setOptions({
    headerTitle: "Moments",
    headerStyle: styles.nav,
    headerTitleStyle: {
      color: "#626060",
      fontWeight: "bold",
      fontSize: 30
    }
  });

  return (
    <BottomTab.Navigator
      initialRouteName="Login/Signup"
      tabBarOptions={{ activeTintColor: "#46C1D5", style: styles.nav }}
    >
      <BottomTab.Screen
        color="red"
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-add" />,
          title: "Upload a Photo",
          unmountOnBlur: true
        }}
      />
      <BottomTab.Screen
        name="Links"
        component={LinksScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
          title: "Albums",
          unmountOnBlur: true
        }}
      />
      <BottomTab.Screen
        name="Socials"
        component={SocialsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-link" />,
          title: "Socials",
          unmountOnBlur: true
        }}
      />
      <BottomTab.Screen
        name="Login/Signup"
        component={LoginScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-person" />,
          title: "Login/Signup",
          unmountOnBlur: false
        }}
      />
    </BottomTab.Navigator>
  );
}

const styles = StyleSheet.create({
  nav: {
    backgroundColor: "#FFFFFF",
    borderWidth: 0
  }
});
