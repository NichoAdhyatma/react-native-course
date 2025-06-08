import { styles } from "@/styles";
import React, { forwardRef } from "react";
import { TextInput as RNTextField, View } from "react-native";
import { HelperText, TextInput, type TextInputProps } from "react-native-paper";

interface TextFieldProps extends TextInputProps {
  errorMessage?: string;
}

const TextField = forwardRef<RNTextField, TextFieldProps>(({ errorMessage, error, ...props }, ref) => {

  return (
    <View>
      <TextInput ref={ref} outlineStyle={styles.input} error={error} {...props} />

      {error && (
        <HelperText type="error" visible={!!error}>
          {errorMessage || "This field is required"}
        </HelperText>
      )}
    </View>
  );
});

TextField.displayName = "TextField";

export default TextField;
