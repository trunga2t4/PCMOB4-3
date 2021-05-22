import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons, AntDesign, Entypo } from "@expo/vector-icons";
import firebase from "../database/firebaseDB";

export default function chatScreen({ navigation }) {
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={logOut}>
          <Ionicons
            name="ios-create-outline"
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
  });

  function logOut() {
    navigation.navigate("Login Screen");
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { justifyContent: "flex-start" },
      ]}
    >
      <Text>Chat Screen</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffc",
    alignItems: "center",
    justifyContent: "center",
  },
});
