import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native";
import firebase from "../database/firebaseDB";
import { GiftedChat } from "react-native-gifted-chat";

const db = firebase.firestore();
const dbRoom = db.collection("chatRooms");
const dbUser = db.collection("users");

const isRegistered = true;
const anonymousUser = { name: "Anonymous", id: "1A" };

var renderedCount = 1;
var sellectedCollection2 = undefined;
var dbChatData = undefined;

export default function SubGroupScreen({ navigation }) {
  console.log(renderedCount++);

  const [messages, setMessages] = useState([]);
  const [allowedRooms, setAllowedRooms] = useState([]);
  const [currentUser, setCurrentUser] = useState(anonymousUser);
  const [currentUserData, setCurrentUserData] = useState(undefined);
  const [collectionList, setCollectionList] = useState(undefined);
  const [sellectedCollection, setSellectedCollection] = useState();

  function loadChatData(collection) {
    console.log("SubGroup loaded: " + collection.collection);
    dbChatData = db.collection(collection.collection);
    //console.log(dbChatData);
    if (dbChatData != undefined) {
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
      return unsubcribe;
    }
    return null;
  }

  async function allowedRoomsQuery() {
    const snapshot = await dbUser
      .where("email", "==", firebase.auth().currentUser.email)
      .get();
    var serverMessages = [];
    snapshot.forEach((doc) => {
      serverMessages = [...serverMessages, doc.data()];
    });
    setCurrentUserData(serverMessages[0]);
    setAllowedRooms(serverMessages[0].collection);
    const snapshot2 = await dbRoom
      .where("collection", "in", serverMessages[0].collection)
      .get();
    var serverMessages2 = [];
    snapshot2.forEach((doc) => {
      serverMessages2 = [...serverMessages2, doc.data()];
    });
    sellectedCollection2 = serverMessages2[0];
    setCollectionList(serverMessages2);
    setSellectedCollection(sellectedCollection2);
    loadChatData(sellectedCollection2);
    dbChatData = db.collection(sellectedCollection2.collection);
    return { snapshot2, snapshot };
  }

  function onSend(messages) {
    dbChatData = db.collection(sellectedCollection.collection);
    dbChatData.add(messages[0]);
  }

  function setRoomTitle(item) {
    sellectedCollection2 = item;
    setSellectedCollection(sellectedCollection2);
    loadChatData(sellectedCollection2);
  }

  function renderItem({ item }) {
    return (
      <View style={styles.flatList}>
        <TouchableOpacity onPress={() => setRoomTitle(item)}>
          <Text style={styles.text}>{item.name}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  useEffect(() => {
    allowedRoomsQuery();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser({ id: user.uid, name: user.email });
        navigation.navigate("Chat Screen", {
          id: user.id,
          email: user.email,
        });
      } else {
        setCurrentUser(anonymousUser);
        navigation.navigate("Login Screen", { navigation, isRegistered });
      }
    });
  }, []);

  if (
    firebase.auth().currentUser &&
    sellectedCollection != undefined &&
    collectionList != undefined &&
    currentUserData != undefined
  ) {
    return (
      <View style={styles.container}>
        <View style={styles.container2}>
          <Text style={styles.title}>{sellectedCollection.name}</Text>
        </View>
        <View style={styles.container3}>
          <FlatList
            data={collectionList}
            horizontal
            renderItem={renderItem}
            contentContainerStyle={{
              justifyContent: "space-between",
            }}
            keyExtractor={(item) => "" + item._id}
          />
        </View>
        <View style={[styles.container4]}>
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
  }
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#800000",
  },

  container2: {
    flex: 0.05,
    margin: 10,
    marginBottom: 0,
    alignItems: "center",
  },
  container3: {
    flex: 0.05,
    margin: 10,
    marginBottom: 0,
    alignItems: "center",
    minHeight: 20,
    maxHeight: 40,
  },
  container4: {
    flex: 0.9,
    margin: 10,
    borderRadius: 5,
    backgroundColor: "#FFB6C1",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    alignItems: "center",
    alignContent: "center",
    color: "#FFB6C1",
  },
  flatList: {
    padding: 5,
    borderBottomColor: "#ccc",
    backgroundColor: "#FFB6C1",
    flex: 1,
    borderWidth: 2,
    width: "100%",
  },
});
