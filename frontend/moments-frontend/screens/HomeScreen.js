import * as React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  TouchableHighlight
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Component } from "react";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import axios from "axios";
import StyledButton from "../components/StyledButton";
import StyledDarkButton from "../components/StyledDarkButton";
import StyledAlertButton from "../components/StyledAlertButton";
import LottieView from "lottie-react-native";
import { Auth } from "aws-amplify";

class HomeScreen extends Component {
  state = {
    topView: true,
    image: [],
    uploaded: true,
    visible: false,
    username: "",
    modalVisible: false,
    modalMessage: "No Errors Yet"
  };

  componentDidMount() {
    this.getPermissionAsync();
    Auth.currentAuthenticatedUser()
      .then(response => {
        this.setState({ username: response.username });
      })
      .catch(response => {
        this.setState({ modalVisible: true, modalMessage: "Please Login" });
      });
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
      }

      const { status2 } = await Permissions.askAsync(Permissions.CAMERA);
      if (status2 !== "granted") {
      }
    }
  };

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
    if (!result.cancelled) {
      if (this.state.image.length < 4) {
        this.setState(currentState => {
          return { image: [...currentState.image, result] };
        });
      } else {
        this.setState({
          modalVisible: true,
          modalMessage: "Please upload photos before choosing more"
        });
      }
    }
  };

  takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1
    });
    if (!result.cancelled) {
      if (this.state.image.length < 4) {
        this.setState(currentState => {
          return { image: [...currentState.image, result] };
        });
      } else {
        this.setState({
          modalVisible: true,
          modalMessage: "Please upload photos before choosing more"
        });
      }
    }
  };

  removeImage = uri => {
    this.setState(currentState => {
      const survivingImages = currentState.image.filter(image => {
        return image.uri !== uri;
      });
      return { image: survivingImages };
    });
  };

  uploadImage = event => {
    this.setState({ visible: true });
    this.state.image.forEach(item => {
      let file = Platform.OS === "android" ? item.uri : item.uri.replace("file://", "");
      const data = new FormData();
      data.append("profileImage", {
        uri: file,
        name: "image.jpeg",
        type: "image/jpeg"
      });
      axios
        .post("https://moments-s3.herokuapp.com/api/upload", data, {
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
            "Content-Type": `multipart/form-data; boundary=${data._boundary}`
          }
        })
        .then(response => {
          if (response.status === 200) {
            axios.post(
              `https://0cu7huuz9g.execute-api.eu-west-2.amazonaws.com/latest/api/upload/`,
              { imageLocation: response.data.location, usr: this.state.username }
            );
          }
          this.setState({ image: [], visible: false });
        })
        .catch(error => {
          console.log(error);
        });
    });
  };

  render() {
    const { visible } = this.state;
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
                marginTop: 140,
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
            <Text style={styles.text}>Please Select Images</Text>
          </View>
          <View style={styles.buttonContainerColumn}>
            <>
              <StyledButton text="Camera Roll" onPress={this.pickImage} />
              <StyledButton text="Take Photo" onPress={this.takePicture} />
            </>
            {this.state.image.length === 1 && !visible && (
              <>
                <Text style={styles.smallText}>Tap photos to unselect</Text>
                <TouchableOpacity onPress={() => this.removeImage(this.state.image[0].uri)}>
                  <Image
                    style={styles.photoContainer}
                    source={{ uri: this.state.image[0].uri }}
                  ></Image>
                </TouchableOpacity>
              </>
            )}
            {this.state.image.length > 1 && !visible && (
              <>
                <Text style={styles.smallText}>Tap photos to unselect</Text>
                <View style={styles.smallPhotoContainer}>
                  {this.state.image.reverse().map(item => {
                    return (
                      <TouchableOpacity key={item.uri} onPress={() => this.removeImage(item.uri)}>
                        <Image
                          key={item.uri}
                          style={styles.onePhoto}
                          source={{ uri: item.uri }}
                        ></Image>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            )}
          </View>
          {visible && (
            <View style={styles.lottie}>
              <LottieView
                visible={visible}
                source={require("./orangeLottie.json")}
                autoPlay
                loop
                style={{ height: 200 }}
              />
            </View>
          )}
        </ScrollView>
        {this.state.image.length > 0 && (
          <>
            <View style={styles.bottomButton}>
              <StyledDarkButton text="Upload Photos" onPress={this.uploadImage} />
            </View>
          </>
        )}
      </View>
    );
  }
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3EC4CA"
  },
  contentContainer: {
    alignItems: "center"
  },
  topContainer: {
    backgroundColor: "#0F4B53",
    height: 200,
    width: 450,
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5
  },
  topTitle: {
    marginTop: 20,
    padding: 5,
    width: 320,
    textAlign: "center",
    backgroundColor: "#718183",
    fontSize: 22,
    color: "white"
  },
  topText: {
    marginTop: 10,
    padding: 5,
    width: 320,
    height: 110,
    textAlign: "center",
    backgroundColor: "#718183",
    fontSize: 18,
    color: "white"
  },
  lottie: { width: 100, height: 100, marginTop: 25, marginRight: 90 },
  buttonContainerRow: {
    flex: 0,
    flexDirection: "row"
  },
  buttonContainerColumn: {
    flex: 0,
    flexDirection: "column",
    alignItems: "center"
  },
  photoContainer: {
    margin: 10,
    flex: 0,
    alignItems: "center",
    width: 300,
    height: 300
  },
  smallPhotoContainer: {
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
  smallText: {
    textAlign: "center",
    color: "white",
    fontSize: 20,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 5
  },
  text: {
    color: "white",
    fontSize: 30,
    padding: 20
  },
  bottomButton: {
    flex: 0,
    alignItems: "center"
  }
});
