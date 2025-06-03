import { styles } from "@/styles";
import React from "react";
import { View } from "react-native";
import { HelperText, TextInput, type TextInputProps } from "react-native-paper";

interface TextFieldProps extends TextInputProps {
  errorMessage?: string;
}

const TextField = ({ errorMessage, error, ...props }: TextFieldProps) => {
  return (
    <View>
      <TextInput outlineStyle={styles.input} error={error} {...props} />

      {error && (
        <HelperText type="error" visible={!!error}>
          {errorMessage || "This field is required"}
        </HelperText>
      )}
    </View>
  );
};

export default TextField;
