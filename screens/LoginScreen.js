import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { CheckBox, TextInput, Keyboard } from "react-native";
import firebase from "../database/firebaseDB";

const db = firebase.firestore();
const auth = firebase.auth();

export default function loginScreen({ route, navigation }) {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const isRegistered = route.params.isRegistered;
  const [isTechSelected, setTechSelection] = useState(false);
  const [isArtSelected, setArtSelection] = useState(false);
  const [isMarketSelected, setMarketSelection] = useState(false);

  async function setDocument(userId, displayName, email, photoURL, collection) {
    const data = {
      _id: userId,
      name: displayName,
      email: email,
      avatar: photoURL,
      collection: collection,
    };
    const res = await db.collection("users").doc(userId).set(data);
  }

  function login() {
    Keyboard.dismiss();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log("Logged user" + firebase.auth().currentUser.uid);
      })
      .catch((error) => {
        console.log("Error");
        setError("Wrong email or password. Please try again!");
      });
  }

  function register() {
    const emailLowerCase = email.toLowerCase();
    Keyboard.dismiss();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        let userId = firebase.auth().currentUser.uid;
        let collection = [];
        if (isArtSelected) {
          collection = [...collection, "messagesArt"];
        }
        if (isMarketSelected) {
          collection = [...collection, "messagesMarket"];
        }
        if (isTechSelected) {
          collection = [...collection, "messagesTech"];
        }

        setDocument(userId, displayName, emailLowerCase, photoURL, collection);
        console.log("Registered user: " + userId);
      })
      .catch((error) => {
        console.log("Error");
        setError("User registered or Wrong email/password. Please try again!");
      });
  }

  function toLogin() {
    const isRegistered = true;
    navigation.navigate("Login Screen", { navigation, isRegistered });
  }

  function toRegister() {
    const isRegistered = false;
    navigation.navigate("Login Screen", { navigation, isRegistered });
  }

  if (isRegistered) {
    return (
      <View style={[styles.container, { backgroundColor: "white" }]}>
        <Text style={{ fontSize: 24 }}>Login Page</Text>

        <View style={[styles.container2]}>
          <Text style={{ fontSize: 16 }}>Email</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={(email) => setEmail(email)}
          />
        </View>

        <View style={[styles.container2]}>
          <Text style={{ fontSize: 16 }}>Password</Text>
          <TextInput
            style={styles.textInput}
            value={password}
            onChangeText={(password) => setPassword(password)}
            secureTextEntry={true}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={login}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.container3]}>
          <TouchableOpacity onPress={toRegister}>
            <Text style={{ fontSize: 16, color: "blue" }}>
              Not registered yet? Go to Register Page
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.container3]}>
          <Text style={{ fontSize: 16, color: "red" }}>{error}</Text>
        </View>
      </View>
    );
  } else {
    return (
      <View style={[styles.container, { backgroundColor: "white" }]}>
        <Text style={{ fontSize: 24 }}>Register Page</Text>

        <View style={[styles.container2]}>
          <Text style={{ fontSize: 16 }}>Email</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={(email) => setEmail(email)}
          />
        </View>

        <View style={[styles.container2]}>
          <Text style={{ fontSize: 16 }}>Name</Text>
          <TextInput
            style={styles.textInput}
            value={displayName}
            onChangeText={(displayName) => setDisplayName(displayName)}
          />
        </View>

        <View style={[styles.container2]}>
          <Text style={{ fontSize: 16 }}>Avatar's link</Text>
          <TextInput
            style={styles.textInput}
            value={photoURL}
            onChangeText={(photoURL) => setPhotoURL(photoURL)}
            placeholder="example: https://picsum.photos/id/100/200/"
          />
        </View>

        <View style={[styles.container2]}>
          <Text style={{ fontSize: 16 }}>Password</Text>
          <TextInput
            style={styles.textInput}
            value={password}
            onChangeText={(password) => setPassword(password)}
            secureTextEntry={true}
          />
        </View>

        <View style={[styles.container2]}>
          <Text style={{ fontSize: 16 }}>
            Sellect SubGroubs that you want to join
          </Text>
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={isTechSelected}
              onValueChange={setTechSelection}
              style={styles.checkbox}
            />
            <Text style={styles.label}>Science, Technology and more...</Text>
          </View>
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={isArtSelected}
              onValueChange={setArtSelection}
              style={styles.checkbox}
            />
            <Text style={styles.label}>Art, Music, Movies ...</Text>
          </View>
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={isMarketSelected}
              onValueChange={setMarketSelection}
              style={styles.checkbox}
            />
            <Text style={styles.label}>Marketplace: Buy, Sell, Aution ...</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={register}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.container3]}>
          <TouchableOpacity onPress={toLogin}>
            <Text style={{ fontSize: 16, color: "blue" }}>
              Registered? Go to Login Page.
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.container3]}>
          <Text style={{ fontSize: 16, color: "red" }}>{error}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffc",
    alignItems: "center",
    justifyContent: "center",
  },
  container2: {
    alignItems: "flex-start",
    width: "80%",
  },
  container3: {
    alignItems: "center",
    width: "80%",
  },
  textInput: {
    borderColor: "navy",
    borderWidth: 1,
    width: "100%",
    padding: 2,
    marginBottom: 5,
    color: "navy",
    fontSize: 16,
  },
  button: {
    padding: 10,
    backgroundColor: "navy",
    borderRadius: 5,
    margin: 5,
    width: 80,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 0,
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
});
