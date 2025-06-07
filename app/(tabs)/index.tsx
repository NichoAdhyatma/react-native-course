import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit } from "@/lib/database-type";
import { useLoader } from "@/lib/loader-context";
import { styles } from "@/styles";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import { Swipeable } from "react-native-gesture-handler";
import { Button, Surface, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const { user, signOut } = useAuth();

  const [habits, setHabits] = useState<Habit[]>([]);

  const { setIsLoading, isLoading } = useLoader();

  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});

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

  function renderLeftActions(
    progressAnimatedValue: any,
    dragAnimatedValue: any,
    swipeable: Swipeable
  ): React.ReactNode {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#FF5252",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingLeft: 20,
          marginTop: 10,
          paddingRight: 16,
          marginHorizontal: 10,
          marginBottom: 10,

          borderRadius: 8,
        }}
      >
        <Feather name="trash" size={24} color="white" />
      </View>
    );
  }

  function renderRightActions(
    progressAnimatedValue: any,
    dragAnimatedValue: any,
    swipeable: Swipeable
  ): React.ReactNode {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#4CAF50",
          justifyContent: "center",
          alignItems: "flex-end",
          paddingLeft: 20,
          marginTop: 10,
          marginHorizontal: 10,
          paddingRight: 16,
          marginBottom: 10,

          borderRadius: 8,
        }}
      >
        <Feather name="check-circle" size={24} color="white" />
      </View>
    );
  }

  const handleDeleteHabit = async (habitId: string) => {
    try {
      setIsLoading(true);
      await databases.deleteDocument(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        habitId
      );

      setIsLoading(false);

      getHabits();
    } catch (error) {
      console.error("Error deleting habit:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={getHabits} />
        }
      >
        {habits.length === 0 ? (
          <Text>No Habit created yet.</Text>
        ) : (
          habits.map((habit) => (
            <Swipeable
              key={habit.$id}
              ref={(ref) => {
                swipeableRefs.current[habit.$id] = ref;
              }}
              overshootLeft={false}
              overshootRight={false}
              renderLeftActions={renderLeftActions}
              renderRightActions={renderRightActions}
              onSwipeableOpen={(direction) => {
                if (direction === "left") {
                  // Handle left swipe action
                  handleDeleteHabit(habit.$id);
                }

                swipeableRefs.current[habit.$id]?.close();
              }}
            >
              <Surface style={homeStyles.cardContainer} elevation={0}>
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
                    style={{ color: "grey", marginTop: 4 }}
                  >
                    {habit.description?.length === 0 ? "-" : habit.description}
                  </Text>
                </View>

                <View style={{ ...styles.rowBetween }}>
                  <View style={homeStyles.streakContainer}>
                    <FontAwesome5 name="fire" size={14} color="#FA812F" />

                    <Text variant="bodySmall" style={{ color: "#FA812F" }}>
                      {habit.streak_count} Day Streak
                    </Text>
                  </View>

                  <Text
                    style={{
                      ...homeStyles.frequencyContainer,
                      color: theme.colors.secondary,
                    }}
                  >
                    {habit.frequency}
                  </Text>
                </View>
              </Surface>
            </Swipeable>
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
    paddingHorizontal: 10,
    paddingBottom: 50,
    marginTop: 20,
  },
  cardContainer: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
    marginBottom: 10,
    marginTop: 10,
    marginRight: 10,
    marginLeft: 10,
    gap: 24,
  },
  streakContainer: {
    backgroundColor: "#FEF3E2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  frequencyContainer: {
    backgroundColor: "#F0F4FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Home;
