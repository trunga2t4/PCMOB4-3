import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import firebase from "../database/firebaseDB";
import CommonScreen from "./CommonScreen";
import SubGroupScreen from "./SubGroupScreen";
import PrivateScreen from "./PrivateScreen";

const Tab = createBottomTabNavigator();

export default function chatScreen({ navigation }) {
  useEffect(() => {
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
  });
  function logOut() {
    firebase.auth().signOut();
  }
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Common Room") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "Sub Groups") {
            iconName = focused ? "group" : "group";
          } else if (route.name === "Private Chats") {
            iconName = focused ? "user-secret" : "user-secret";
          }

          return <FontAwesome name={iconName} color={color} size={size} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "blue",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name="Common Room" component={CommonScreen} />
      <Tab.Screen name="Sub Groups" component={SubGroupScreen} />
      <Tab.Screen name="Private Chats" component={PrivateScreen} />
    </Tab.Navigator>
  );
}
