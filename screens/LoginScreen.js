import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from "react-native";
import { Ionicons, AntDesign, Entypo } from "@expo/vector-icons";
import firebase from "../database/firebaseDB";

const db = firebase.firestore();
const auth = firebase.auth();

export default function loginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function login() {
    Keyboard.dismiss();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log("Welcome to our chat");
        navigation.navigate("Chat Screen", { email });
      })
      .catch((error) => {
        console.log("Error");
        setError("Wrong email or password. Please try again!");
      });
  }

  return (
    <View style={[styles.container, { backgroundColor: "white" }]}>
      <Text style={{ fontSize: 24 }}>Chat App</Text>

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
      <View style={[styles.container2]}>
        <Text style={{ fontSize: 16, color: "red" }}>{error}</Text>
      </View>
    </View>
  );
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
  textInput: {
    borderColor: "grey",
    borderWidth: 1,
    width: "100%",
    padding: 10,
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    padding: 10,
    backgroundColor: "orange",
    borderRadius: 5,
    margin: 10,
    marginTop: 30,
    width: 80,
  },
  buttonText: {
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
  },
});
