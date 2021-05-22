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

export default function loginScreen({ navigation }) {
  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { justifyContent: "flex-start" },
      ]}
    >
      <Text>Login Screen</Text>
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
