import TextField from "@/components/TextField";
import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { useLoader } from "@/lib/loader-context";
import { styles } from "@/styles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { ID } from "react-native-appwrite";
import { Button, SegmentedButtons } from "react-native-paper";
import { z } from "zod";

const frequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const habitSchema = z.object({
  title: z
    .string()
    .min(1, "Habit title is required")
    .refine((val) => val.trim() !== "", {
      message: "Habit title cannot be empty",
    })
    .refine((val) => val.length <= 256, {
      message: "Habit title must be less than 256 characters",
    }),
  description: z
    .string()
    .optional()
    .refine((val) => val && val.length <= 1000, {
      message: "Description must be less than 1000 characters",
    }),
  frequency: z.enum(["daily", "weekly", "monthly"], {
    errorMap: () => ({ message: "Please select a frequency" }),
  }),
});

type HabitFormData = z.infer<typeof habitSchema>;

const AddHabitScreen = () => {
  const { control, handleSubmit, reset, setFocus } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      title: "",
      description: "",
      frequency: "weekly",
    },
  });

  const { user } = useAuth();

  const { setIsLoading } = useLoader();

  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      // Reset form when the screen is focused
      reset({
        title: "",
        description: "",
        frequency: "weekly",
      });
    }, [reset])
  );

  const onSubmit = async (data: HabitFormData) => {
    setIsLoading(true);

    const { title, description, frequency } = data;
    // Here you would typically send the data to your backend or state management
    if (!user?.$id) {
      console.error("User is not authenticated");
      return;
    }

    try {
      await databases.createDocument(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        ID.unique(),
        {
          user_id: user.$id,
          title,
          description,
          frequency,
          streak_count: 0,
          last_completed: new Date().toISOString(),
          created_at: new Date().toISOString(),
        }
      );

      router.back();
    } catch (error) {
      console.error("Error creating habit:", error);
    }

    setIsLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        backgroundColor: "white",
        flex: 1,
        padding: 20,
        gap: 20,
      }}
    >
      <Controller
        control={control}
        name="title"
        render={({ field, fieldState }) => (
          <TextField
            mode="outlined"
            label={"Title"}
            placeholder="Your habit title"
            outlineStyle={styles.input}
            onChangeText={field.onChange}
            error={!!fieldState.error?.message}
            errorMessage={fieldState.error?.message}
            onSubmitEditing={() => {
              setFocus("description");
            }}
            {...field}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field, fieldState }) => (
          <TextField
            mode="outlined"
            label={"Description"}
            placeholder="Your habit description"
            outlineStyle={styles.input}
            onChangeText={field.onChange}
            error={!!fieldState.error?.message}
            errorMessage={fieldState.error?.message}
            onSubmitEditing={() => {
              handleSubmit(onSubmit)();
            }}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="frequency"
        render={({ field }) => (
          <View>
            <SegmentedButtons
              style={{
                borderRadius: 8,
              }}
              value={field.value}
              onValueChange={field.onChange}
              buttons={frequencyOptions}
            />
          </View>
        )}
      />

      <Button
        style={styles.button}
        mode="contained"
        onPress={handleSubmit(onSubmit)}
      >
        Create Habit
      </Button>
    </KeyboardAvoidingView>
  );
};

export default AddHabitScreen;
