import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { Checkbox, FAB } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";

export default function HomeScreen() {
  const [goals, setGoals] = useState([]);
  const [greeting, setGreeting] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const loadGoals = async () => {
      const storedGoals = await AsyncStorage.getItem("goals");
      if (storedGoals) setGoals(JSON.parse(storedGoals));
    };

    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good Morning! ☀️");
      else if (hour < 18) setGreeting("Good Afternoon! 🌤️");
      else setGreeting("Good Evening! 🌙");
    };

    updateGreeting();
    const unsubscribe = navigation.addListener("focus", loadGoals);
    return unsubscribe;
  }, [navigation]);

  // ✅ Toggle Goal Completion
  const toggleGoalCompletion = async (index) => {
    const updatedGoals = [...goals];
    updatedGoals[index].completed = !updatedGoals[index].completed;

    setGoals(updatedGoals);
    await AsyncStorage.setItem("goals", JSON.stringify(updatedGoals));
  };

  // ✅ Delete Goal
  const deleteGoal = async (index) => {
    const updatedGoals = goals.filter((_, i) => i !== index);
    setGoals(updatedGoals);
    await AsyncStorage.setItem("goals", JSON.stringify(updatedGoals));
  };

  // ✅ Swipe-to-Delete Render Function
  const renderRightActions = (index) => (
    <View style={styles.deleteContainer}>
      <Text style={styles.deleteText} onPress={() => deleteGoal(index)}>
        🗑️ Delete
      </Text>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#00264D", "#004080", "#0066CC"]}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" />

        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", damping: 10 }}
        >
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.subtext}>Stay focused and achieve your goals! 🚀</Text>
        </MotiView>

        {/* Goal List with Swipe-to-Delete */}
        <ScrollView style={styles.goalList}>
          {goals.length > 0 ? (
            goals.map((goal, index) => (
              <Swipeable
                key={index}
                renderRightActions={() => renderRightActions(index)}
              >
                <MotiView
                  from={{ opacity: 0, translateX: -20 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ type: "spring", damping: 10, delay: index * 100 }}
                  style={[styles.goalItem, goal.completed && styles.completedGoal]}
                >
                  {/* ✅ Checkbox for Completion */}
                  <Checkbox.Android
                    status={goal.completed ? "checked" : "unchecked"}
                    onPress={() => toggleGoalCompletion(index)}
                    color="#FFD700"
                  />

                  <View style={styles.goalTextContainer}>
                    <Text style={[styles.goalText, goal.completed && styles.goalTextCompleted]}>
                      {goal.title}
                    </Text>
                    <Text style={styles.goalCategory}>{goal.category}</Text>
                  </View>
                </MotiView>
              </Swipeable>
            ))
          ) : (
            <Text style={styles.noGoalText}>No goals yet. Start by adding one!</Text>
          )}
        </ScrollView>

        {/* Floating Action Button */}
        <FAB style={styles.fab} icon="plus" onPress={() => navigation.navigate("AddGoal")} />
      </LinearGradient>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtext: {
    fontSize: 16,
    color: "#B0E0E6",
    textAlign: "center",
    marginBottom: 20,
  },
  goalList: {
    flex: 1,
    marginTop: 10,
  },
  goalItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  completedGoal: {
    backgroundColor: "rgba(144, 238, 144, 0.2)",
  },
  goalTextContainer: {
    marginLeft: 10,
  },
  goalText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  goalTextCompleted: {
    textDecorationLine: "line-through",
    color: "#B0E0E6",
  },
  goalCategory: {
    fontSize: 14,
    color: "#B0E0E6",
    marginTop: 5,
  },
  noGoalText: {
    fontSize: 16,
    color: "#B0E0E6",
    textAlign: "center",
    marginTop: 20,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#FFD700",
  },
  deleteContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF3B30",
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  deleteText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
