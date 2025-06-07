import AuthGuard from "@/components/AuthGuard";
import LoaderOverlay from "@/components/LoaderOverlay";
import { AuthProvider } from "@/lib/auth-context";
import { LoaderProvider } from "@/lib/loader-context";
import { lighttheme } from "@/styles/theme";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

const theme = {
  ...DefaultTheme,
  ...lighttheme,
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LoaderProvider>
        <AuthProvider>
          <PaperProvider theme={theme}>
            <SafeAreaProvider>
              <AuthGuard>
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="auth"
                    options={{
                      title: "Auth Page",
                      headerShown: false,
                    }}
                  />
                </Stack>
                <LoaderOverlay />
              </AuthGuard>
            </SafeAreaProvider>
          </PaperProvider>
        </AuthProvider>
      </LoaderProvider>
    </GestureHandlerRootView>
  );
}
