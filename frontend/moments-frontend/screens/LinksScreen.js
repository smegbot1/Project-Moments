import * as React from "react";
import { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  RefreshControl,
  TouchableOpacity,
  Alert,
  TouchableHighlight
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import StyledDarkButton from "../components/StyledDarkButton";
import StyledAlertButton from "../components/StyledAlertButton";
import { Auth } from "aws-amplify";
import LottieView from "lottie-react-native";

class LinksScreen extends Component {
  isMounted = false;
  state = {
    photos: [],
    updated: false,
    username: "",
    refreshing: false,
    modalVisible: false,
    modalMessage: "No Errors Yet"
  };

  componentDidMount() {
    this.isMounted = true;
    Auth.currentAuthenticatedUser()
      .then(response => {
        this.setState({ username: response.username });
        axios
          .get(
            `https://0cu7huuz9g.execute-api.eu-west-2.amazonaws.com/latest/api/upload/${this.state.username}`
          )
          .then(response => {
            this.setState({ photos: response.data.images });
          });
      })
      .catch(response => {
        this.setState({ modalVisible: true, modalMessage: "Please Login" });
      });
  }

  updatePhotos = () => {
    axios
      .get(
        `https://0cu7huuz9g.execute-api.eu-west-2.amazonaws.com/latest/api/upload/${this.state.username}`
      )
      .then(response => {
        this.setState({ photos: response.data.images });
        setTimeout(() => {
          this.setTimePassed();
        }, 3000);
      })
      .catch(error => {
        console.log(error);
      });
  };

  setTimePassed = () => {
    this.setState({ refreshing: false });
  };

  deleteImageFromDB = url => {
    const data = { url: url };
    axios
      .post(
        `https://0cu7huuz9g.execute-api.eu-west-2.amazonaws.com/latest/api/images/${this.state.username}`,
        data
      )
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
    this.setState(currentState => {
      const survivingPhotos = currentState.photos.filter(photo => {
        return photo !== url;
      });
      survivingPhotos.reverse();
      return { photos: survivingPhotos };
    });
  };

  changeActiveUser = () => {
    const data = { usr: this.state.username };
    axios
      .patch(`https://0cu7huuz9g.execute-api.eu-west-2.amazonaws.com/latest/api/activeuser/`, data)
      .then(response => {
        console.log(response);
      });
  };

  componentWillUnmount() {
    this.isMounted = false;
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.updatePhotos();
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }
        >
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <View
              style={{
                flex: 0,
                width: 350,
                height: 300,
                marginTop: 150,
                alignSelf: "center",
                alignItems: "center",
                justifyContent: "space-around",
                backgroundColor: "white",
                borderRadius: 25
              }}
            >
              <LottieView
                visible={this.state.modalVisible}
                source={require("./errorCross.json")}
                autoPlay
                loop
                style={{ height: 100 }}
              />
              <Text>{this.state.modalMessage}</Text>
              <TouchableHighlight>
                <StyledAlertButton
                  onPress={() => {
                    this.setState({ modalVisible: false });
                  }}
                  text={"OK"}
                ></StyledAlertButton>
              </TouchableHighlight>
            </View>
          </Modal>

          <View>
            <Text style={styles.text}>Your Current Images</Text>
          </View>

          <View style={styles.top}>
            {this.state.photos.length > 0 && (
              <Text style={styles.smallText}>
                Tap photos to remove them from your frame Pull down to refresh images
              </Text>
            )}
          </View>

          <View style={styles.photoContainer}>
            {this.state.photos.reverse().map(url => {
              return (
                <View key={url}>
                  <TouchableOpacity onPress={() => this.deleteImageFromDB(url)}>
                    <Image style={styles.onePhoto} source={{ url }}></Image>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </ScrollView>
        <View style={styles.bottomButton}>
          <StyledDarkButton text="Frame My Moments" onPress={this.changeActiveUser} />
        </View>
      </View>
    );
  }
}

export default LinksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3EC4CA"
  },
  contentContainer: {
    paddingTop: 30,
    alignItems: "center"
  },
  top: {
    alignItems: "center"
  },
  photoContainer: {
    flex: 0,
    width: 400,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly"
  },
  onePhoto: {
    backgroundColor: "white",
    marginTop: 25,
    height: 150,
    width: 150
  },
  text: {
    color: "white",
    fontSize: 30,
    padding: 20
  },
  smallText: {
    textAlign: "center",
    color: "white",
    fontSize: 15,
    paddingTop: 10,
    paddingLeft: 50,
    paddingRight: 50
  },
  bottomButton: {
    flex: 0,
    alignItems: "center"
  }
});
