import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { TouchableOpacity, FlatList } from "react-native";
import firebase from "../database/firebaseDB";
import { GiftedChat } from "react-native-gifted-chat";
var renderedCount = 1;

const db = firebase.firestore();
const anonymousUser = { name: "Anonymous", id: "1A" };

export default function PrivateScreen({ navigation }) {
  console.log(renderedCount++);

  const [messages, setMessages] = useState([]);
  const [userList, setUserList] = useState(undefined);
  const isRegistered = true;
  const [currentUser, setCurrentUser] = useState(anonymousUser);
  const [currentUserData, setCurrentUserData] = useState(undefined);
  const [contactedUserData, setContactedUserData] = useState(undefined);

  async function userListQuery(email) {
    console.log("userListQuery");
    const snapshot = await db
      .collection("users")
      .where("email", "!=", email)
      .get();
    var serverMessages = [];
    snapshot.forEach((doc) => {
      serverMessages = [...serverMessages, doc.data()];
    });
    console.log(serverMessages);
    setUserList(serverMessages);
    return { snapshot };
  }

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

  async function setRoomData(item) {
    setContactedUserData(item);
    const privateRoom =
      item._id > currentUserData._id
        ? currentUserData._id + item._id
        : item._id + currentUserData._id;
    console.log(privateRoom);
    if (currentUserData) {
      console.log([item._id + currentUserData._id]);
      const snapshot = db
        .collection("messagesPrivate")
        .where("privateRoom", "==", privateRoom)
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
          console.log(serverMessages);
          setMessages(serverMessages);
        });
      return { snapshot };
    }
    return null;
  }

  function onSend(messages) {
    const privateRoom =
      contactedUserData._id > currentUserData._id
        ? currentUserData._id + contactedUserData._id
        : contactedUserData._id + currentUserData._id;
    console.log({ ...messages[0], privateRoom: privateRoom });
    db.collection("messagesPrivate").add({
      ...messages[0],
      privateRoom: privateRoom,
    });
  }

  function renderItem({ item }) {
    return (
      <View style={styles.flatList}>
        <TouchableOpacity onPress={() => setRoomData(item)}>
          <Image
            style={styles.tinyLogo}
            source={{
              uri: item.avatar,
            }}
          />
          <Text style={styles.text}>{item.name}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        userListQuery(firebase.auth().currentUser.email);
        userQuery();
        setCurrentUser({ id: user.uid, name: user.email });
        navigation.navigate("Chat Screen", { id: user.id, email: user.email });
      } else {
        setCurrentUser(anonymousUser);
        navigation.navigate("Login Screen", { navigation, isRegistered });
      }
    });
  }, []);

  if (firebase.auth().currentUser && currentUserData != undefined) {
    return (
      <View style={styles.container}>
        <View style={styles.container2}>
          <Text style={styles.title}>Peer-to-Peer Chats</Text>
        </View>
        <View style={[styles.container3]}>
          <View style={styles.container4}>
            <FlatList
              data={userList}
              renderItem={renderItem}
              contentContainerStyle={{
                justifyContent: "space-between",
              }}
              keyExtractor={(item) => "" + item._id}
            />
          </View>
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
    backgroundColor: "black",
  },
  container2: {
    flex: 0.05,
    margin: 10,
    marginBottom: 0,
    alignItems: "center",
  },
  container3: {
    flex: 0.95,
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
    flexDirection: "row",
    color: "#C3C3C3",
  },
  container4: {
    width: 75,
    marginLeft: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    alignItems: "center",
    alignContent: "center",
    color: "#C3C3C3",
  },
  flatList: {
    backgroundColor: "#C3C3C3",
    flex: 1,
    borderWidth: 2,
    width: "100%",
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    alignItems: "center",
    alignContent: "center",
    color: "black",
  },
  tinyLogo: {
    width: 75,
    height: 75,
  },
});
