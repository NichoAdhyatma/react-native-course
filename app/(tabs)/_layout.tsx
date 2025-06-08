import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { Tabs } from "expo-router";
import React from "react";
import { useTheme } from "react-native-paper";

const TabsLayout = () => {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#ffffff" },
        headerTitleAlign: "center",
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          elevation: 0,
          borderTopWidth: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: theme.colors.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="add-habit"
        options={{
          title: "Add Habit",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="add-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="streaks"
        options={{
          title: "Streaks",
          tabBarIcon: ({ color, size }) => (
            <SimpleLineIcons name="graph" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
