import { useAuth } from "@/lib/auth-context";
import { useLoader } from "@/lib/loader-context";
import { styles } from "@/styles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, NativeSyntheticEvent, Platform, StyleSheet, TextInputSubmitEditingEventData, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type AuthFormData = z.infer<typeof authSchema>;

const AuthScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = form;

  const { signIn, signUp } = useAuth();

  const { setIsLoading } = useLoader();

  const handleAuth = async (data: AuthFormData) => {
    setIsLoading(true);

    if (isSignUp) {
      const error = await signUp(data.email, data.password);

      if (error) {
        console.error("Sign Up Error:", error);

        setError("root", {
          type: "manual",
          message: error,
        });
      }
    } else {
      const error = await signIn(data.email, data.password);

      if (error) {
        console.error("Sign In Error:", error);

        setError("root", {
          type: "manual",
          message: error,
        });
      }
    }

    setIsLoading(false);

    reset(
      {},
      {
        keepErrors: true,
      }
    );
  };

  const handleSwitchMode = () => {
    setIsSignUp((prev) => !prev);
  };

  const handleSubmitEditing = (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    const value = event.nativeEvent.text;
    
    if (value) {
      handleAuth(form.getValues());
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={authStyles.container}
    >
      <View style={authStyles.content}>
        <Text variant="headlineMedium" style={authStyles.title}>
          {isSignUp ? "Create Account" : "Welcome Back"}
        </Text>

        {errors.root && (
          <HelperText type="error" visible={true}>
            {errors.root.message}
          </HelperText>
        )}

        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <View>
              <TextInput
                label="Email"
                mode="outlined"
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Enter your email"
                outlineStyle={styles.input}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={!!errors.email}
              />

              {errors.email && (
                <HelperText type="error" visible={!!errors.email}>
                  {errors.email?.message}
                </HelperText>
              )}
            </View>
          )}
        />

        {/* Password */}
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <View>
              <TextInput
                label="Password"
                mode="outlined"
                secureTextEntry
                placeholder="Enter your password"
                outlineStyle={styles.input}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={!!errors.password}
                onSubmitEditing={handleSubmitEditing}
                returnKeyType="done"
              />
              {errors.password && (
                <HelperText type="error" visible={!!errors.password}>
                  {errors.password?.message}
                </HelperText>
              )}
            </View>
          )}
        />

        <View>
          <Button
            mode="contained"
            onPress={handleSubmit(handleAuth)}
            style={{
              marginTop: 20,
              ...styles.button,
            }}
          >
            {isSignUp ? "Sign Up" : "Sign in"}
          </Button>

          <Button
            mode="text"
            onPress={handleSwitchMode}
            style={{ marginTop: 8 }}
          >
            {isSignUp
              ? "Already have an account ? Sign In"
              : "Don't have an account ? Sign Up"}
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;

const authStyles = StyleSheet.create({
  container: {
    ...styles.centerXY,
  },
  content: {
    padding: 20,
    width: "100%",
    gap: 20,
  },
  title: {
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
});
