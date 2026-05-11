import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { palette } from '@/constants/todo-theme';
import type { Task } from '@/types/task';

import { styles } from './styles';

type TaskDetailModalProps = {
  onClose: () => void;
  onUpdateDescription: (id: string, description: string) => void;
  task: Task | null;
};

const formatCreatedAt = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

export function TaskDetailModal({
  onClose,
  onUpdateDescription,
  task,
}: TaskDetailModalProps) {
  const descriptionInputRef = useRef<TextInput>(null);
  const [draftDescription, setDraftDescription] = useState('');

  useEffect(() => {
    setDraftDescription(task?.description ?? '');
  }, [task]);

  useEffect(() => {
    if (!task) {
      return;
    }

    const focusTimeout = setTimeout(() => {
      descriptionInputRef.current?.focus();
    }, 180);

    return () => clearTimeout(focusTimeout);
  }, [task]);

  if (!task) {
    return null;
  }

  const hasChanges = draftDescription !== (task.description ?? '');

  const handleCancel = () => {
    setDraftDescription(task.description ?? '');
    onClose();
  };

  const handleSave = () => {
    if (hasChanges) {
      onUpdateDescription(task.id, draftDescription);
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onClose();
  };

  return (
    <View style={styles.detailScreen}>
      <View style={styles.detailTopBar}>
        <Pressable
          accessibilityLabel="Back to tasks"
          accessibilityRole="button"
          hitSlop={8}
          onPress={handleCancel}
          style={({ pressed }) => [
            styles.detailCloseButton,
            pressed ? styles.pressed : undefined,
          ]}>
          <Feather name="chevron-left" size={24} color={palette.ink} />
        </Pressable>
        <Pressable
          accessibilityLabel="Save task details"
          accessibilityRole="button"
          disabled={!hasChanges}
          hitSlop={8}
          onPress={handleSave}
          style={({ pressed }) => [
            styles.detailSaveIconButton,
            !hasChanges ? styles.detailSaveIconButtonDisabled : undefined,
            pressed && hasChanges ? styles.pressed : undefined,
          ]}>
          <Feather name="check" size={21} color={palette.white} />
        </Pressable>
      </View>
      <View style={styles.detailHeader}>
        <Text style={styles.detailEyebrow}>Added {formatCreatedAt(task.createdAt)}</Text>
        <Text style={styles.detailTitle}>{task.title}</Text>
      </View>
      <View style={styles.detailComposer}>
        <TextInput
          ref={descriptionInputRef}
          multiline
          onChangeText={setDraftDescription}
          placeholder="Add a description"
          placeholderTextColor="#A09A90"
          style={styles.detailDescriptionInput}
          textAlignVertical="top"
          value={draftDescription}
        />
      </View>
    </View>
  );
}
