import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { Picker } from "@react-native-picker/picker"; // Import Picker
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddGoalScreen({ navigation }) {
    const [goal, setGoal] = useState("");
    const [category, setCategory] = useState("Academics");

    const handleAddGoal = async () => {
        if (!goal.trim()) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Fetch existing goals
        const storedGoals = await AsyncStorage.getItem("goals");
        const goalsArray = storedGoals ? JSON.parse(storedGoals) : [];

        // Add new goal with category
        const newGoal = { title: goal, category, completed: false };
        const newGoals = [...goalsArray, newGoal];

        await AsyncStorage.setItem("goals", JSON.stringify(newGoals));

        setGoal("");
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>🎯 Add a New Goal</Text>
            
            {/* Goal Input */}
            <TextInput
                label="Goal Title"
                value={goal}
                onChangeText={setGoal}
                mode="outlined"
                style={styles.input}
            />

            {/* Category Picker */}
            <Text style={styles.label}>Select Category:</Text>
            <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="📖 Academics" value="Academics" />
                <Picker.Item label="🏋️ Fitness" value="Fitness" />
                <Picker.Item label="💻 Personal Projects" value="Projects" />
                <Picker.Item label="🎭 Social Life" value="Social" />
                <Picker.Item label="📚 Self-Improvement" value="Self-Improvement" />
            </Picker>

            {/* Add Goal Button */}
            <Button mode="contained" onPress={handleAddGoal} style={styles.button}>
                Add Goal
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
    },
    picker: {
        height: 50,
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#0088CC",
    },
});
