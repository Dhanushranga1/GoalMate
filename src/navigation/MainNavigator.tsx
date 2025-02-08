import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import ProgressScreen  from "../screens/ProgressScreen";
import LearningHubScreen from "../screens/LearningHubScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AddGoalScreen from "../screens/AddGoalScreen";
import { Ionicons } from "@expo/vector-icons";

export type RootTabParamList = {
  HomeTab: undefined;
  Progress: undefined;
  LearningHub: undefined;
  Profile: undefined;
};

// ✅ Create a Stack Navigator for Home + Add Goal
const HomeStackNavigator = createStackNavigator();

function HomeStack() {
  return (
    <HomeStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <HomeStackNavigator.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStackNavigator.Screen name="AddGoal" component={AddGoalScreen} />
    </HomeStackNavigator.Navigator>
  );
}

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function MainNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            switch (route.name) {
              case "HomeTab":
                iconName = "home-outline";
                break;
              case "Progress":
                iconName = "bar-chart-outline";
                break;
              case "LearningHub":
                iconName = "book-outline";
                break;
              case "Profile":
                iconName = "person-outline";
                break;
              default:
                iconName = "help-circle-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        {/* ✅ Changed HomeTab to avoid duplicate "Home" name */}
        <Tab.Screen name="HomeTab" component={HomeStack} />
        <Tab.Screen name="Progress" component={ProgressScreen} />
        <Tab.Screen name="LearningHub" component={LearningHubScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
