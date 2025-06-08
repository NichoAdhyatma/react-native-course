import { useHabit } from "@/hooks/useHabit";
import { styles } from "@/styles";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

interface StreakData {
  longestStreak: number;
  currentStreak: number;
  totalCompletions: number;
}

const StraksPage = () => {
  const { habitCompletions, habits, fetchAllData } = useHabit();

  const theme = useTheme();

  useFocusEffect(
    useCallback(() => {
      fetchAllData("streak");
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const getStreakData = (habitId: string): StreakData => {
    const sortedHabitCompletions = habitCompletions
      .filter((completion) => completion.habit_id === habitId)
      .sort(
        (a, b) =>
          new Date(a.completed_at).getTime() -
          new Date(b.completed_at).getTime()
      );

    if (sortedHabitCompletions.length === 0) {
      return {
        longestStreak: 0,
        currentStreak: 0,
        totalCompletions: 0,
      };
    }

    let longestStreak = 0;
    let currentStreak = 0;
    let totalCompletions = sortedHabitCompletions.length;

    let lastCompletionDate: Date | null = null;

    sortedHabitCompletions.forEach((completion) => {
      const completionDate = new Date(completion.completed_at);

      if (lastCompletionDate) {
        const dayDifference =
          (completionDate.getTime() - lastCompletionDate.getTime()) /
          (1000 * 3600 * 24);

        if (dayDifference === 1) {
          currentStreak++;
        } else {
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 1; // reset streak
        }
      } else {
        currentStreak = 1; // first completion
      }
      lastCompletionDate = completionDate;
    });

    longestStreak = Math.max(longestStreak, currentStreak);

    return {
      longestStreak,
      currentStreak,
      totalCompletions,
    };
  };

  const habitStreaks = habits.map((habit) => {
    const streakData = getStreakData(habit.$id);

    return {
      ...habit,
      ...streakData,
    };
  });

  const rankedHabits = habitStreaks.sort((a, b) => {
    if (a.longestStreak !== b.longestStreak) {
      return b.longestStreak - a.longestStreak; // Sort by longest streak first
    }
    if (a.currentStreak !== b.currentStreak) {
      return b.currentStreak - a.currentStreak; // Then by current streak
    }
    return b.totalCompletions - a.totalCompletions; // Finally by total completions
  });

  if (habits.length === 0) {
    return (
      <View style={styles.centerXY}>
        <Text>No habits found. Start by creating a new habit!</Text>
      </View>
    );
  }

  const leaderBoardColor = [
    "#FFD63A", // Gold
    "#7F8CAA", // Silver
    "#CA7842", // Bronze
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text
        variant="headlineSmall"
        style={{
          fontWeight: "bold",
          paddingHorizontal: 20,
        }}
      >
        Habit Streaks
      </Text>

      <Surface
        style={{
          ...streaksStyles.cardContainer,
          paddingHorizontal: 20,
          margin: 20,
          marginBottom: 10,
          gap: 4,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <SimpleLineIcons
            name="badge"
            size={24}
            color={theme.colors.primary}
          />
          <Text
            variant="titleMedium"
            style={{
              color: theme.colors.primary,
              fontWeight: 600,
            }}
          >
            Habits Leaderboard
          </Text>
        </View>

        <Text variant="bodyMedium" style={{ color: "grey", marginTop: 4 }}>
          Your top 3 habits with the longest streaks.
        </Text>

        {rankedHabits.slice(0, 3).map((habit, index) => (
          <View
            key={habit.$id}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <View
                style={{
                  borderRadius: 50,
                  backgroundColor: leaderBoardColor[index] || "#E4EFE7",

                  alignItems: "center",
                  justifyContent: "center",
                  width: 30,
                  height: 30,
                }}
              >
                <Text
                  variant="bodyLarge"
                  style={{
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {index + 1}
                </Text>
              </View>
              <Text style={{ fontWeight: 600 }}>{habit.title}</Text>
            </View>
            <Text style={{ color: theme.colors.primary, fontWeight: 600 }}>
              {habit.longestStreak} days
            </Text>
          </View>
        ))}
      </Surface>

      <ScrollView
        contentContainerStyle={{ ...styles.scrollView, gap: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => fetchAllData("streak")}
          />
        }
      >
        {rankedHabits.map((habit, index) => (
          <Surface
            key={habit.$id}
            style={[
              streaksStyles.cardContainer,
              index === 0 && {
                borderColor: theme.colors.primary,
                borderWidth: 2,
              },
            ]}
            elevation={0}
          >
            <View>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {habit.title}
              </Text>
              <Text
                variant="bodySmall"
                ellipsizeMode="tail"
                numberOfLines={2}
                style={{ color: "grey", marginTop: 4 }}
              >
                {habit.description?.length === 0 ? "-" : habit.description}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                flex: 1,
                justifyContent: "space-evenly",
              }}
            >
              <View
                style={{
                  ...streaksStyles.badgeContainer,
                  backgroundColor: "#FCEF91",
                }}
              >
                <FontAwesome6 name="trophy" size={16} color="#E6521F" />

                <Text
                  variant="bodyLarge"
                  style={{
                    fontWeight: "bold",
                    color: "#E6521F",
                    marginTop: 4,
                  }}
                >
                  {habit.longestStreak}
                </Text>
                <Text
                  variant="bodySmall"
                  style={{
                    fontWeight: "bold",
                    color: "#E6521F",
                  }}
                >
                  Best
                </Text>
              </View>

              <View
                style={{
                  ...streaksStyles.badgeContainer,
                  backgroundColor: "#F4E7E1",
                }}
              >
                <FontAwesome6
                  name="fire-flame-curved"
                  size={16}
                  color="#D5451B"
                />

                <Text
                  variant="bodyLarge"
                  style={{
                    fontWeight: "bold",
                    color: "#D5451B",
                    marginTop: 4,
                  }}
                >
                  {habit.currentStreak}
                </Text>
                <Text
                  variant="bodySmall"
                  style={{
                    fontWeight: "bold",
                    color: "#D5451B",
                  }}
                >
                  Current
                </Text>
              </View>

              <View
                style={{
                  ...streaksStyles.badgeContainer,
                  backgroundColor: "#E4EFE7",
                }}
              >
                <FontAwesome6 name="check-circle" size={16} color={"#328E6E"} />

                <Text
                  variant="bodyLarge"
                  style={{
                    fontWeight: "bold",
                    color: "#328E6E",
                    marginTop: 4,
                  }}
                >
                  {habit.totalCompletions}
                </Text>
                <Text
                  variant="bodySmall"
                  style={{
                    fontWeight: "bold",
                    color: "#328E6E",
                  }}
                >
                  Total
                </Text>
              </View>
            </View>
          </Surface>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StraksPage;

const streaksStyles = StyleSheet.create({
  cardContainer: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
    gap: 24,
  },
  badgeContainer: {
    maxWidth: 70,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    padding: 10,
  },
});
