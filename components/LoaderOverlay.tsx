import React from "react";
import { ActivityIndicator, Portal, Surface } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { useLoader } from "@/lib/loader-context";

const LoaderOverlay = () => {
  const { isLoading } = useLoader();

  if (!isLoading) return null;

  return (
    <Portal>
      <View style={styles.overlay}>
        <Surface style={styles.container} elevation={4}>
          <ActivityIndicator size={24} animating={true} />
        </Surface>
      </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)", 
    zIndex: 999,
  },
  container: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: "white",
  },
});

export default LoaderOverlay;
