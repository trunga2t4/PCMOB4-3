import React, { useEffect, useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Button,
} from "react-native";
import { Ionicons, AntDesign, Entypo } from "@expo/vector-icons";
import firebase from "../database/firebaseDB";
import { GiftedChat } from "react-native-gifted-chat";

const db = firebase.firestore().collection("messages");

export default function chatScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const unsubcribe = db
      .orderBy("createdAt", "desc")
      .onSnapshot((collectionSnapshot) => {
        const serverMessages = collectionSnapshot.docs.map((doc) => {
          const data = doc.data();
          const jsDate = new Date(data.createdAt.seconds * 1000);
          const newDoc = {
            ...data,
            createdAt: jsDate,
          };
          return newDoc;
        });
        setMessages(serverMessages);
      });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("Chat Screen", { id: user.id, email: user.email });
      } else {
        navigation.navigate("Login Screen");
      }
    });

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={logOut}>
          <Ionicons
            name="log-out"
            size={30}
            color="black"
            style={{
              color: "#f55",
              marginRight: 10,
            }}
          />
        </TouchableOpacity>
      ),
    });
    return unsubcribe;
  }, []);

  function logOut() {
    firebase.auth().signOut();
  }

  function onSend(messages) {
    console.log(messages);
    db.add(messages[0]);
  }

  if (firebase.auth().currentUser) {
    return (
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: firebase.auth().currentUser.uid,
          name: firebase.auth().currentUser.email,
          //avatar: "https://placeimg.com/140/140/any",
        }}
      />
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffc",
    alignItems: "center",
    justifyContent: "center",
  },
});
