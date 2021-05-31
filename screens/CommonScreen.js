import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import firebase from "../database/firebaseDB";
import { GiftedChat } from "react-native-gifted-chat";
var renderedCount = 1;

const anonymousUser = { name: "Anonymous", id: "1A" };

const db = firebase.firestore();
const dbUser = db.collection("users");
const dbChatData = db.collection("messages");

export default function CommonScreen({ navigation }) {
  console.log(renderedCount++);

  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(anonymousUser);
  const [currentUserData, setCurrentUserData] = useState(undefined);
  const isRegistered = true;

  async function userQuery() {
    console.log("userQuery");
    const snapshot = await db
      .collection("users")
      .where("email", "==", firebase.auth().currentUser.email)
      .get();
    var serverMessages = [];
    snapshot.forEach((doc) => {
      serverMessages = [...serverMessages, doc.data()];
    });
    console.log(serverMessages);
    setCurrentUserData(serverMessages[0]);
    return { snapshot };
  }

  function onSend(messages) {
    console.log(messages);
    dbChatData.add(messages[0]);
  }

  useEffect(() => {
    const unsubcribe = dbChatData
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
        userQuery();
        setCurrentUser({ id: user.uid, name: user.email });
        navigation.navigate("Chat Screen", { id: user.id, email: user.email });
      } else {
        setCurrentUser(anonymousUser);
        navigation.navigate("Login Screen", { navigation, isRegistered });
      }
    });
    return unsubcribe;
  }, []);

  if (firebase.auth().currentUser && currentUserData != undefined) {
    return (
      <View style={styles.container}>
        <View style={styles.container2}>
          <Text style={styles.title}>Common Chat Room</Text>
        </View>
        <View style={[styles.container3]}>
          <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{
              _id: firebase.auth().currentUser.uid,
              name: currentUserData.name,
              avatar: currentUserData.avatar,
            }}
          />
        </View>
      </View>
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "navy",
  },

  container2: {
    flex: 0.05,
    margin: 10,
    marginBottom: 0,
    alignItems: "center",
  },
  container3: {
    flex: 0.95,
    margin: 10,
    borderRadius: 5,
    backgroundColor: "#ffc",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    alignItems: "center",
    alignContent: "center",
    color: "#ffc",
  },
});
