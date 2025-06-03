import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  centerXY: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    height: "100%",
    width: "100%",
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
    cursor: "pointer",
  },
  column: {
    display: "flex",
    flexDirection: "column",
  },
  button: {
    borderRadius: 8,
  },
  input: {
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  rowBetween: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
