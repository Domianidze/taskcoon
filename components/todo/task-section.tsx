import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { Text, View } from 'react-native';
import DraggableFlatList, { type RenderItemParams } from 'react-native-draggable-flatlist';

import type { Task } from '@/types/task';

import { styles } from './styles';
import { TaskRow } from './task-row';

type TaskSectionProps = {
  onDelete: (id: string) => void;
  onOpenTask: (id: string) => void;
  onReorder: (tasks: Task[]) => void;
  onToggle: (id: string) => void;
  tasks: Task[];
  title?: string;
};

export function TaskSection({
  onDelete,
  onOpenTask,
  onReorder,
  onToggle,
  tasks,
  title,
}: TaskSectionProps) {
  const renderTask = useCallback(
    ({ drag, isActive, item }: RenderItemParams<Task>) => (
      <TaskRow
        isDragging={isActive}
        onDelete={onDelete}
        onDrag={drag}
        onOpen={onOpenTask}
        onToggle={onToggle}
        task={item}
      />
    ),
    [onDelete, onOpenTask, onToggle],
  );

  return (
    <View style={styles.section}>
      {tasks.length && title ? (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionCount}>{tasks.length}</Text>
        </View>
      ) : null}
      {tasks.length ? (
        <DraggableFlatList
          activationDistance={8}
          contentContainerStyle={styles.taskScrollContent}
          data={tasks}
          keyExtractor={(task) => task.id}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View style={styles.taskHintRow}>
              <Text style={styles.taskHintText}>Long-press to reorder</Text>
              <Text style={styles.taskHintText}>Swipe left to delete</Text>
            </View>
          }
          onDragBegin={() => {
            void Haptics.selectionAsync();
          }}
          onDragEnd={({ data, from, to }) => {
            if (from !== to) {
              requestAnimationFrame(() => {
                onReorder(data);
              });
            }

            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          renderItem={renderTask}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState} />
      )}
    </View>
  );
}
