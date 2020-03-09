import React, { Component } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  Modal,
  TouchableHighlight
} from "react-native";
import StyledButton from "../components/StyledButton";
import StyledDarkButton from "../components/StyledDarkButton";
import StyledAlertButton from "../components/StyledAlertButton";
import Amplify, { Auth } from "aws-amplify";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import LottieView from "lottie-react-native";
import Constants from "expo-constants";
import config from "../aws-exports";
import axios from "axios";

Amplify.configure(config);

export default class LoginScreen extends Component {
  isMounted = false;
  state = {
    image: null,
    uploaded: true,
    visible: false,
    username: "",
    password: "",
    email: "",
    code: "",
    hasSignedUp: false,
    needsToSignUp: false,
    hasSignedIn: false,
    modalVisible: false,
    modalVisibleSignUp: false,
    modalMessage: "No Errors Yet"
  };

  componentDidMount() {
    this.getPermissionAsync();
    this.isMounted = true;
    Auth.currentAuthenticatedUser()
      .then(response => {
        this.setState({ hasSignedIn: true, username: response.username });
      })
      .catch(response => {});
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

  takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
    if (!result.cancelled) {
      this.setState({ image: result });
    }
  };

  uploadReferenceImage = () => {
    this.setState({ visible: true });
    let file =
      Platform.OS === "android"
        ? this.state.image.uri
        : this.state.image.uri.replace("file://", "");
    const data = new FormData();
    data.append("profileImage", {
      uri: file,
      name: "image.jpeg",
      type: "image/jpeg"
    });
    axios
      .post(`https://moments-s3.herokuapp.com/api/upload/reference/${this.state.username}`, data, {
        headers: {
          accept: "application/json",
          "Accept-Language": "en-US,en;q=0.8",
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`
        }
      })
      .then(response => {
        this.setState({ image: null, visible: false });
      });
  };

  showSignUp = () => {
    this.setState({ needsToSignUp: true });
  };

  signUp = () => {
    if (this.state.username !== "" && this.state.email !== "" && this.state.password !== "") {
      const lowerUsername = this.state.username.toLowerCase();
      Auth.signUp({
        username: lowerUsername,
        password: this.state.password,
        attributes: { email: this.state.email }
      })
        .then(response => {
          this.setState({
            hasSignedUp: true,
            username: lowerUsername,
            modalVisibleSignUp: true,
            modalMessage: "Check email for sign up code"
          });
          data = { usr: response.user.username };
          axios
            .post(
              `https://0cu7huuz9g.execute-api.eu-west-2.amazonaws.com/latest/api/createuser/`,
              data
            )
            .then(response => {
              console.log(response, "Inside axios createUser response");
            });
        })
        .catch(error => {
          if (
            error.code === "UsernameExistsException" ||
            error.message === "Invalid email address format."
          ) {
            this.setState({ modalVisible: true, modalMessage: error.message });
          } else {
            this.setState({
              modalVisible: true,
              modalMessage: "Password must contain more than 6 characters"
            });
          }
        });
    }
  };

  switchToLogin = () => {
    this.setState({ needsToSignUp: false });
  };

  confirmSignUp = () => {
    if (this.state.username !== "" && this.state.code.length === 6) {
      Auth.confirmSignUp(this.state.username, this.state.code)
        .then(response => {
          Auth.signIn(this.state.username, this.state.password).then(response => {
            this.setState({ hasSignedIn: true });
          });
        })
        .catch(error => {
          this.setState({ modalVisibleSignUp: true, modalMessage: "Please Enter Correct Code" });
        });
    } else {
      this.setState({ modalVisible: true, modalMessage: "Code Should Be 6 Numbers" });
    }
  };

  signIn = () => {
    if (this.state.username !== "" && this.state.password !== "") {
      Auth.signIn(this.state.username, this.state.password)
        .then(response => {
          this.setState({
            hasSignedIn: true,
            password: "",
            email: "",
            code: ""
          });
        })
        .catch(error => {
          this.setState({ modalVisible: true, modalMessage: error.message });
        });
    }
  };

  signOut = () => {
    Auth.signOut().then(response => {
      this.setState({ hasSignedIn: false, username: "" });
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
            <View style={styles.modal}>
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
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisibleSignUp}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <View style={styles.modal}>
              <LottieView
                visible={this.state.modalVisibleSignUp}
                source={require("./sendMailFast.json")}
                autoPlay
                loop
                style={{ height: 150 }}
              />
              <Text>{this.state.modalMessage}</Text>
              <TouchableHighlight>
                <StyledAlertButton
                  onPress={() => {
                    this.setState({ modalVisibleSignUp: false });
                  }}
                  text={"OK"}
                ></StyledAlertButton>
              </TouchableHighlight>
            </View>
          </Modal>

          <View style={styles.buttonContainerColumn}>
            {this.state.hasSignedIn ? (
              <>
                <Text style={styles.text}> Hello {this.state.username} ! </Text>
                <Text style={styles.smallText}>
                  {" "}
                  In order for your frame to recognise you please take a clear photo of your face
                  and upload it to our recognition database{" "}
                </Text>
                <StyledButton text="Take Reference Photo" onPress={this.takePicture} />

                {this.state.image && !this.state.visible && (
                  <>
                    <Text style={styles.text}>Photo ready to upload</Text>
                    <Image
                      style={styles.photoContainer}
                      source={{ uri: this.state.image.uri }}
                    ></Image>
                    <StyledButton text="Upload Image" onPress={this.uploadReferenceImage} />
                  </>
                )}
                {this.state.visible && (
                  <View style={styles.lottie}>
                    <LottieView
                      visible={this.state.visible}
                      source={require("./orangeLottie.json")}
                      autoPlay
                      loop
                      style={{ height: 200 }}
                    />
                  </View>
                )}

                <StyledDarkButton text="Sign Out" onPress={this.signOut} />
              </>
            ) : (
              <>
                {this.state.needsToSignUp ? (
                  <>
                    <TextInput
                      style={styles.inputBox}
                      value={this.state.username}
                      onChangeText={username => {
                        if (username.includes("-")) {
                          alert("Username can not contain hyphens.");
                        } else {
                          this.setState({ username });
                        }
                      }}
                      placeholder={"Username"}
                      placeholderTextColor={"#E4E3E3"}
                    />
                    <TextInput
                      style={styles.inputBox}
                      value={this.state.password}
                      onChangeText={password => this.setState({ password })}
                      placeholder={"password"}
                      placeholderTextColor={"#E4E3E3"}
                      secureTextEntry={true}
                    />
                    <TextInput
                      style={styles.inputBox}
                      value={this.state.email}
                      onChangeText={email => this.setState({ email })}
                      placeholder={"email"}
                      placeholderTextColor={"#E4E3E3"}
                    />
                    <StyledButton text="SignUp" onPress={this.signUp} />
                    <TextInput
                      style={styles.inputBox}
                      value={this.state.code}
                      onChangeText={code => this.setState({ code })}
                      placeholder={"Sign Up Code"}
                      placeholderTextColor={"#E4E3E3"}
                    />
                    <StyledButton text="Confirm Signup Code" onPress={this.confirmSignUp} />
                    <StyledButton text="Log In Instead" onPress={this.switchToLogin} />
                  </>
                ) : (
                  <>
                    <TextInput
                      style={styles.inputBox}
                      value={this.state.username}
                      onChangeText={username => this.setState({ username })}
                      placeholder={"Username"}
                      placeholderTextColor={"#E4E3E3"}
                    />
                    <TextInput
                      style={styles.inputBox}
                      value={this.state.password}
                      onChangeText={password => this.setState({ password })}
                      placeholder={"password"}
                      placeholderTextColor={"#E4E3E3"}
                      secureTextEntry={true}
                    />
                    <StyledButton text="Sign In" onPress={this.signIn} />
                    <StyledButton text="Register" onPress={this.showSignUp} />
                  </>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3EC4CA"
  },
  contentContainer: {
    paddingTop: 15,
    alignItems: "center"
  },
  photoContainer: {
    margin: 10,
    flex: 0,
    alignItems: "center",
    width: 250,
    height: 250
  },
  modal: {
    flex: 0,
    width: 350,
    height: 300,
    marginTop: 200,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "white",
    borderRadius: 25
  },
  lottie: { marginTop: 25 },
  inputBox: {
    padding: 10,
    color: "white",
    fontSize: 30
  },
  buttonContainerColumn: {
    paddingTop: 70,
    flex: 0,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around"
  },
  text: {
    color: "white",
    fontSize: 30,
    padding: 20,
    textAlign: "center"
  },
  smallText: {
    textAlign: "center",
    color: "white",
    fontSize: 15,
    paddingTop: 20,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 5
  }
});
