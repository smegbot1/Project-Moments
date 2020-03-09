import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  TouchableHighlight
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import StyledButton from "../components/StyledButton";
import StyledDarkButton from "../components/StyledDarkButton";
import { Auth } from "aws-amplify";
import LottieView from "lottie-react-native";
import StyledAlertButton from "../components/StyledAlertButton";

class SocialsScreen extends Component {
  state = {
    instaUsername: "",
    instaPhotos: [],
    valid: true,
    reason: "Invalid Input",
    username: "",
    visible: false,
    modalVisible: false
  };

  componentDidMount() {
    Auth.currentAuthenticatedUser()
      .then(response => {
        this.setState({ username: response.username });
      })
      .catch(response => {
        this.setState({ modalVisible: true, modalMessage: "Please Login" });
      });
  }

  updateUsername = event => {
    this.setState({ instaUsername: event });
  };

  getInstaPhotos = () => {
    if (this.state.instaUsername !== "") {
      this.setState({ instaUsername: "", instaPhotos: [] });
      axios
        .get(`https://www.instagram.com/${this.state.instaUsername}/?__a=1&max_id=<end_cursor>`)
        .then(({ data }) => {
          let URLs = data.graphql.user.edge_owner_to_timeline_media.edges.map(item => {
            if (item.node.display_url !== undefined && item.node.display_url !== null) {
              return item.node.display_url;
            }
          });
          if (URLs.length > 0) {
            this.setState({ instaPhotos: URLs, valid: true });
          } else {
            this.setState({ reason: "Instagram Is Private" });
          }
        })
        .catch(error => {
          this.setState({ valid: false, reason: "Invalid Input" });
        });
    } else {
      this.setState({ valid: false, reason: "Invalid Input" });
    }
  };

  uploadMultipleImages = () => {
    this.setState({ visible: true });
    const selectedFiles = this.state.instaPhotos;
    selectedFiles.map(url => {
      axios
        .patch(
          `https://k8445cuwvd.execute-api.eu-west-2.amazonaws.com/latest/api/photos/${this.state.username}`,
          { photos: url }
        )
        .then(response => {
          this.setState({ instaPhotos: [], visible: false });
        });
    });
  };

  removeImage = url => {
    this.setState(currentState => {
      const survivingImages = currentState.instaPhotos.filter(image => {
        return image !== url;
      });
      return { instaPhotos: survivingImages };
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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
            <Text style={styles.text}>Get Your Photos from Social Media</Text>
          </View>
          {this.state.instaPhotos.length === 0 && (
            <>
              <View style={styles.buttonContainer}>
                <Text style={styles.smallText}> Enter instagram username to connect: </Text>
                <TextInput
                  style={{
                    height: 40,
                    width: 300,
                    marginBottom: 10,
                    paddingLeft: 15,
                    borderColor: "gray",
                    borderWidth: 1,
                    color: "white"
                  }}
                  onChangeText={this.updateUsername}
                  value={this.state.instaUsername}
                />
                <StyledButton text="Connect Instagram" onPress={this.getInstaPhotos} />
              </View>
            </>
          )}
          {this.state.instaPhotos.length > 0 && !this.state.visible && (
            <>
              <View style={styles.buttonContainer}>
                <Text style={styles.smallText}>
                  Tap photos to remove them from your selection before uploading to your frame
                </Text>
                <View style={styles.photoContainer}>
                  {this.state.instaPhotos.map(url => {
                    return (
                      <View key={url}>
                        <TouchableOpacity onPress={() => this.removeImage(url)}>
                          <Image style={styles.onePhoto} source={{ url }}></Image>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </View>
            </>
          )}
          {this.state.visible && (
            <View style={styles.container}>
              <LottieView
                visible={this.state.visible}
                source={require("./orangeLottie.json")}
                autoPlay
                loop
                style={{ height: 200 }}
              />
            </View>
          )}
        </ScrollView>

        {this.state.instaPhotos.length > 0 && (
          <View style={styles.bottomButton}>
            <StyledDarkButton text="Send To Frame" onPress={this.uploadMultipleImages} />
          </View>
        )}
      </View>
    );
  }
}

export default SocialsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3EC4CA"
  },
  contentContainer: {
    paddingTop: 30,
    alignItems: "center"
  },
  buttonContainer: {
    flex: 0,
    width: 400,
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
    textAlign: "center",
    color: "white",
    fontSize: 30,
    paddingTop: 20,
    paddingLeft: 30,
    paddingRight: 30
  },
  smallText: {
    textAlign: "center",
    color: "white",
    fontSize: 15,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 5
  },
  bottomButton: {
    flex: 0,
    alignItems: "center"
  }
});
