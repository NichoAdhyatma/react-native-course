import { useHabit } from "@/hooks/useHabit";
import { useAuth } from "@/lib/auth-context";
import { useLoader } from "@/lib/loader-context";
import { renderLeftActions, renderRightActions } from "@/lib/swipeable";
import { styles } from "@/styles";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Button, Surface, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const { user, signOut } = useAuth();

  const { setIsLoading, isLoading } = useLoader();

  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});

  const {
    fetchAllData,
    habits,
    handleCompleteHabit,
    handleDeleteHabit,
    isHabitCompleted,
  } = useHabit();

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

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        return;
      }

      fetchAllData("home");

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
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => fetchAllData("home")}
          />
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
              renderRightActions={() =>
                renderRightActions(isHabitCompleted(habit.$id))
              }
              onSwipeableOpen={(direction) => {
                if (direction === "left") {
                  // Handle left swipe action
                  handleDeleteHabit(habit.$id);
                } else {
                  handleCompleteHabit(habit.$id);
                }

                swipeableRefs.current[habit.$id]?.close();
              }}
            >
              <Surface style={[homeStyles.cardContainer]} elevation={0}>
                {isHabitCompleted(habit.$id) && (
                  <View style={homeStyles.completedBadge}>
                    <Feather name="check-circle" size={14} color="green" />
                    <Text
                      variant="bodySmall"
                      style={{
                        color: "green",
                        fontWeight: 600,
                      }}
                    >
                      Completed
                    </Text>
                  </View>
                )}
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

                    <Text
                      variant="bodySmall"
                      style={{ color: "#FA812F", fontWeight: 600 }}
                    >
                      {habit.streak_count} Day Streak
                    </Text>
                  </View>

                  <Text
                    variant="bodySmall"
                    style={{
                      ...homeStyles.frequencyContainer,
                      fontWeight: 600,
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
    paddingBottom: 50,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  cardContainer: {
    position: "relative",
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
  cardCompleted: {
    opacity: 0.7,
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
  completedBadge: {
    position: "absolute",
    right: 10,
    top: 10,
    borderRadius: 50,
    backgroundColor: "rgba(0, 255, 0, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
});

export default Home;
