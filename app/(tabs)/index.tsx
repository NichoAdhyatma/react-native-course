import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit } from "@/lib/database-type";
import { useLoader } from "@/lib/loader-context";
import { styles } from "@/styles";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import { Button, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const { user, signOut } = useAuth();

  const [habits, setHabits] = useState<Habit[]>([]);

  const { setIsLoading, isLoading } = useLoader();

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getHabits = async () => {
    if (!user?.$id) {
      return;
    }

    setIsLoading(true);

    try {
      const habits = await databases.listDocuments(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        [Query.equal("user_id", user?.$id), Query.orderDesc("created_at")]
      );

      setHabits(habits.documents as Habit[]);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }

    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      if (user) {
        getHabits();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])
  );

  const theme = useTheme();

  return (
    <SafeAreaView style={homeStyles.safeArea}>
      <View style={{ paddingHorizontal: 20, ...styles.rowBetween }}>
        <Text
          variant="headlineSmall"
          style={{
            fontWeight: "bold",
          }}
        >
          {"Today's"} Habits
        </Text>

        <Button onPress={handleSignOut} icon={"logout"}>
          Sign Out
        </Button>
      </View>

      {/* <LoaderOverlay /> */}
      <ScrollView
        contentContainerStyle={homeStyles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={getHabits} />
        }
      >
        {habits.length === 0 ? (
          <Text>No Habit created yet.</Text>
        ) : (
          habits.map((habit) => (
            <View
              key={habit.$id}
              style={{
                padding: 20,
                backgroundColor: "#ffffff",
                borderRadius: 8,
                boxShadow: "0 1px 4px rgba(0,0,0,0.2)",

                gap: 24,
              }}
            >
              <View>
                <Text
                  variant="titleMedium"
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={{ fontWeight: 600 }}
                >
                  {habit.title}
                </Text>
                <Text
                  variant="bodySmall"
                  ellipsizeMode="tail"
                  numberOfLines={2}
                  style={{ color: "grey" }}
                >
                  {habit.description?.length === 0 ? "-" : habit.description}
                </Text>
              </View>

              <View style={{ ...styles.rowBetween }}>
                <View
                  style={{
                    backgroundColor: "#FEF3E2",

                    padding: 8,
                    borderRadius: 8,
                  }}
                >
                  <Text variant="bodySmall" style={{ color: "#FA812F" }}>
                    {habit.streak_count} Day Streak
                  </Text>
                </View>

                <Text style={{ color: theme.colors.secondary }}>
                  {habit.frequency}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const homeStyles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#ffffff",
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingBottom: 50,
    marginTop: 20,
    gap: 20,
  },
});

export default Home;
