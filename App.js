import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import chatScreen from "./screens/chatScreen";
import loginScreen from "./screens/loginScreen";

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator mode="modal">
        <Stack.Screen
          name="Chat Screen"
          component={chatScreen}
          options={{
            title: "From Atom to Universe, Share Here!",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#ffc",
              shadowColor: "black",
              shadowOpacity: 0.2,
              shadowRadius: 5,
            },
            headerTintColor: "#f55",
            headerTitleStyle: {
              fontSize: 18,
              color: "navy",
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Login Screen"
          component={loginScreen}
          options={{
            title: "Login",
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
