import { Feather } from '@expo/vector-icons';
import { useRef } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { palette } from '@/constants/todo-theme';

import { styles } from './styles';

type TaskComposerProps = {
  onAddTask: () => void;
  onFocusChange: (isFocused: boolean) => void;
  setTaskText: (value: string) => void;
  taskText: string;
};

export function TaskComposer({
  onAddTask,
  onFocusChange,
  setTaskText,
  taskText,
}: TaskComposerProps) {
  const canAddTask = Boolean(taskText.trim());
  const inputRef = useRef<TextInput>(null);

  const handleAddPress = () => {
    onAddTask();
    inputRef.current?.blur();
  };

  return (
    <View style={styles.composer}>
      <View style={styles.inputWrap}>
        <TextInput
          ref={inputRef}
          value={taskText}
          onChangeText={setTaskText}
          onBlur={() => onFocusChange(false)}
          onFocus={() => onFocusChange(true)}
          onSubmitEditing={onAddTask}
          placeholder="Name a new task"
          placeholderTextColor="#9A968D"
          returnKeyType="done"
          style={styles.taskInput}
        />
        <Pressable
          accessibilityLabel="Add task"
          accessibilityRole="button"
          disabled={!canAddTask}
          hitSlop={8}
          onPress={handleAddPress}
          style={({ pressed }) => [
            styles.addTaskButton,
            !canAddTask && styles.addTaskButtonDisabled,
            pressed && canAddTask ? styles.pressed : undefined,
          ]}>
          <Feather name="plus" size={20} color={palette.white} />
        </Pressable>
      </View>
    </View>
  );
}
