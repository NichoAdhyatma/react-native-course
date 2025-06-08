import { Models } from "react-native-appwrite";

export interface Habit extends Models.Document {
    title: string;
    description?: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    user_id: string;
    created_at: string;
    last_completed: string;
}

export interface HabitCompletion extends Models.Document {
    habit_id: string;
    user_id: string;
    completed_at: string;
}