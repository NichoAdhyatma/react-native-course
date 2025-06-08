import {
  DATABASE_ID,
  HABITS_COLLECTION_ID,
  HABIT_COMPLETIONS_ID,
  databases,
} from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit, HabitCompletion } from "@/lib/database-type";
import { useLoader } from "@/lib/loader-context";
import { useState } from "react";
import { ID, Query } from "react-native-appwrite";

export const useHabit = () => {
  const { user } = useAuth();

  const { setIsLoading } = useLoader();

  const [habits, setHabits] = useState<Habit[]>([]);

  const [completedHabitIds, setCompletedHabitIds] = useState<string[]>([]);

  const [habitCompletions, setHabitCompletions] = useState<HabitCompletion[]>(
    []
  );

  const getHabits = async () => {
    if (!user?.$id) {
      return;
    }
    try {
      const habits = await databases.listDocuments<Habit>(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        [Query.equal("user_id", user?.$id), Query.orderDesc("created_at")]
      );

      setHabits(habits.documents);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const getHabitTodayCompletions = async () => {
    if (!user?.$id) {
      return;
    }

    try {
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      const completions = await databases.listDocuments<HabitCompletion>(
        DATABASE_ID,
        HABIT_COMPLETIONS_ID,
        [
          Query.equal("user_id", user?.$id),
          Query.greaterThanEqual("completed_at", today.toISOString()),
        ]
      );

      const completedHabitIds = completions.documents.map(
        (completion) => completion.habit_id
      );

      setCompletedHabitIds(completedHabitIds);
    } catch (error) {
      console.error("Error fetching habit completions:", error);
    }
  };

  const getHabitCompletions = async () => {
    if (!user?.$id) {
      return;
    }

    try {
      const completions = await databases.listDocuments<HabitCompletion>(
        DATABASE_ID,
        HABIT_COMPLETIONS_ID,
        [Query.equal("user_id", user?.$id)]
      );

      setHabitCompletions(completions.documents);
    } catch (error) {
      console.error("Error fetching habit completions:", error);
    }
  };

  const fetchAllData = async (page: "home" | "streak") => {
    if (!user) return;

    setIsLoading(true);

    if (page === "home") {
      await Promise.all([getHabits(), getHabitTodayCompletions()]);
    }

    if (page === "streak") {
      await Promise.all([getHabits(), getHabitCompletions()]);
    }

    setIsLoading(false);
  };

  const isHabitCompleted = (habitId: string): boolean => {
    return completedHabitIds.includes(habitId);
  };

  const handleDeleteHabit = async (habitId: string) => {
    try {
      setIsLoading(true);

      await databases.deleteDocument(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        habitId
      );

      setIsLoading(false);

      fetchAllData('home');
    } catch (error) {
      console.error("Error deleting habit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteHabit = async (habitId: string) => {
    if (!user || completedHabitIds.includes(habitId)) {
      return;
    }

    try {
      setIsLoading(true);

      const currentDate = new Date().toISOString();

      await databases.createDocument(
        DATABASE_ID,
        HABIT_COMPLETIONS_ID,
        ID.unique(),
        {
          habit_id: habitId,
          user_id: user?.$id || "",
          completed_at: currentDate,
        }
      );

      const habit = habits.find((h) => h.$id === habitId);
      if (!habit) return;

      await databases.updateDocument(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        habitId,
        {
          streak_count: habit.streak_count + 1,
          last_completed: currentDate,
        }
      );

      fetchAllData('home');
    } catch (error) {
      console.error("Error completing habit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    habits,
    completedHabitIds,
    getHabits,
    getHabitTodayCompletions,
    fetchAllData,
    habitCompletions,
    getHabitCompletions,
    isHabitCompleted,
    handleDeleteHabit,
    handleCompleteHabit,
  };
};
