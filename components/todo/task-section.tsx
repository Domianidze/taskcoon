import { Text, View } from 'react-native';

import type { Task } from '@/types/task';

import { styles } from './styles';
import { TaskRow } from './task-row';

type TaskSectionProps = {
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  tasks: Task[];
  title?: string;
};

export function TaskSection({ onDelete, onToggle, tasks, title }: TaskSectionProps) {
  return (
    <View style={styles.section}>
      {tasks.length && title ? (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionCount}>{tasks.length}</Text>
        </View>
      ) : null}
      {tasks.length ? (
        <View style={styles.taskList}>
          <Text
            style={{
              color: '#9F8772',
              opacity: 0.72,
              fontSize: 11,
              fontFamily: 'Nunito-Bold',
              letterSpacing: 0.2,
              textAlign: 'right',
              paddingHorizontal: 6,
              marginBottom: -2,
            }}>
            Swipe left to delete
          </Text>
          {tasks.map((task) => (
            <TaskRow key={task.id} onDelete={onDelete} onToggle={onToggle} task={task} />
          ))}
        </View>
      ) : (
        <View style={styles.emptyState} />
      )}
    </View>
  );
}
