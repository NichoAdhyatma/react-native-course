import Feather from "@expo/vector-icons/Feather";
import { View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Text } from "react-native-paper";

export function renderLeftActions(
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

export function renderRightActions(isHabitCompleted: boolean): React.ReactNode {
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
      {isHabitCompleted ? (
        <Text style={{ color: "white", fontWeight: 600 }}>Completed!</Text> // Don't show the right action if the habit is already completed
      ) : (
        <Feather name="check-circle" size={24} color="white" />
      )}
    </View>
  );
}
