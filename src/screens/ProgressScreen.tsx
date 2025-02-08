import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { BarChart, PieChart } from "react-native-chart-kit";

export default function ProgressScreen() {
  const [goals, setGoals] = useState([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const loadGoals = async () => {
      const storedGoals = await AsyncStorage.getItem("goals");
      if (storedGoals) {
        const parsedGoals = JSON.parse(storedGoals);
        setGoals(parsedGoals);

        // ✅ Calculate streak (consecutive completed days)
        const completedToday = parsedGoals.some((goal) => goal.completed);
        if (completedToday) {
          const storedStreak = await AsyncStorage.getItem("streak");
          const currentStreak = storedStreak ? parseInt(storedStreak) : 0;
          await AsyncStorage.setItem("streak", (currentStreak + 1).toString());
          setStreak(currentStreak + 1);
        }
      }
    };
    loadGoals();
  }, []);

  // ✅ Calculate Progress
  const completedGoals = goals.filter((goal) => goal.completed).length;
  const pendingGoals = goals.length - completedGoals;

  return (
    <LinearGradient colors={["#004080", "#0066CC"]} style={styles.container}>
      <Text style={styles.header}>📊 Progress Overview</Text>

      {/* Streak Section */}
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 10 }}
        style={styles.streakContainer}
      >
        <Text style={styles.streakText}>🔥 Streak: {streak} Days</Text>
      </MotiView>

      {/* Pie Chart: Completed vs. Pending Goals */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Completion Rate</Text>
        <PieChart
          data={[
            { name: "Completed", population: completedGoals, color: "#FFD700", legendFontColor: "#fff", legendFontSize: 15 },
            { name: "Pending", population: pendingGoals, color: "#FF6347", legendFontColor: "#fff", legendFontSize: 15 },
          ]}
          width={Dimensions.get("window").width - 40}
          height={200}
          chartConfig={{
            backgroundColor: "#004080",
            backgroundGradientFrom: "#004080",
            backgroundGradientTo: "#0066CC",
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      </View>

      {/* Bar Chart: Goal Categories Breakdown */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Goals by Category</Text>
        <BarChart
          data={{
            labels: ["Academics", "Fitness", "Projects", "Social", "Self-Improvement"],
            datasets: [{ data: [
              goals.filter((g) => g.category === "Academics").length,
              goals.filter((g) => g.category === "Fitness").length,
              goals.filter((g) => g.category === "Projects").length,
              goals.filter((g) => g.category === "Social").length,
              goals.filter((g) => g.category === "Self-Improvement").length
            ]}]
          }}
          width={Dimensions.get("window").width - 40}
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: "#004080",
            backgroundGradientFrom: "#004080",
            backgroundGradientTo: "#0066CC",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            barPercentage: 0.5,
          }}
          style={{ borderRadius: 10 }}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  streakContainer: {
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  streakText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD700",
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 10,
  },
});

