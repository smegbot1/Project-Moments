import * as React from "react";
import { Platform, StatusBar, StyleSheet, View, Text, Image, Styles } from "react-native";
import { SplashScreen } from "expo";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import useLinking from "./navigation/useLinking";
import AppIntroSlider from "react-native-app-intro-slider";

const Stack = createStackNavigator();

function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const [showApp, setShowApp] = React.useState(false);
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

  const slides = [
    {
      key: "moments1",
      title: "Welcome To Moments",
      text: "The Photo Sharing App",
      text2: "Swipe to Get Started",
      image: require("./assets/images/diverse-group.png"),
      height: 250,
      width: 380,
      backgroundColor: "#3EC4CA"
    },
    {
      key: "moments2",
      title: "Upload Photos From Your Mobile Device",
      text: "Works on ios or Android",
      text2: "Connects to social media",
      image: require("./assets/images/man-phone.png"),
      height: 300,
      width: 300,
      backgroundColor: "#ffb92b"
    },
    {
      key: "moments3",
      title: "Photos Stored Seamlessly In The Cloud",
      text: "Secure storage",
      text2: "for your photos",
      image: require("./assets/images/secure-cloud.png"),
      height: 300,
      width: 300,
      backgroundColor: "#EE562D"
    },
    {
      key: "moments4",
      title: "Secure Facial Recognition",
      text: "Personalised display shows",
      text2: "photos from your account",
      image: require("./assets/images/facial-recognition.png"),
      height: 300,
      width: 300,
      backgroundColor: "#78CAFA"
    },
    {
      key: "moments5",
      title: "Enjoy Your Pictures On The Frame",
      text: "Share photos effortlessly around",
      text2: "the home or with relatives",
      image: require("./assets/images/family-frame.png"),
      height: 270,
      width: 350,
      backgroundColor: "#f4858e"
    }
  ];

  _renderItem = ({ item }) => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: item.backgroundColor
        }}
      >
        <Text style={styles.slideTitle}>{item.title}</Text>
        <Image
          source={item.image}
          style={{
            height: item.height,
            width: item.width
          }}
        />
        <View style={styles.slideText}>
          <Text style={styles.infoText}>{item.text}</Text>
          <Text style={styles.infoText}>{item.text2}</Text>
        </View>
      </View>
    );
  };
  _onDone = () => {
    setShowApp(true);
  };

  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();
        setInitialNavigationState(await getInitialState());
      } catch (error) {
        console.warn(error);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else if (showApp) {
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
          <Stack.Navigator>
            <Stack.Screen name="Root" component={BottomTabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  } else {
    return (
      <AppIntroSlider
        showSkipButton={true}
        slides={slides}
        renderItem={_renderItem}
        onDone={_onDone}
      />
    );
  }
}

const styles = StyleSheet.create({
  introContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around"
  },
  slide: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center"
  },
  slideTitle: {
    margin: 15,
    fontSize: 45,
    color: "white",
    textAlign: "center"
  },
  slideText: {
    height: 200
  },
  infoText: {
    color: "white",
    fontSize: 25,
    padding: 10,
    textAlign: "center"
  }
});

export default App;
