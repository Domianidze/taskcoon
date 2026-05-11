import { forwardRef, type ComponentProps } from 'react';
import { TextInput, View } from 'react-native';

import { styles } from './styles';

type LabelledInputProps = ComponentProps<typeof TextInput>;

export const LabelledInput = forwardRef<TextInput, LabelledInputProps>(
  (props, ref) => (
    <View style={styles.field}>
      <View style={styles.loginInputWrap}>
        <TextInput
          autoCapitalize="none"
          placeholderTextColor="#A09A90"
          returnKeyType="done"
          style={styles.loginInput}
          ref={ref}
          {...props}
        />
      </View>
    </View>
  ),
);

LabelledInput.displayName = 'LabelledInput';
