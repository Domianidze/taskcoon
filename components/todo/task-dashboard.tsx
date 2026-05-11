import { Feather } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { palette } from '@/constants/todo-theme';
import type { Task } from '@/types/task';

import { MascotCounter } from './mascot-counter';
import { styles } from './styles';
import { TaskComposer } from './task-composer';
import { TaskSection } from './task-section';

type TaskDashboardProps = {
  completedCount: number;
  intro: Animated.Value;
  isTaskInputFocused: boolean;
  onAddTask: () => void;
  onDeleteTask: (id: string) => void;
  onLogout: () => void;
  onTaskInputFocusChange: (isFocused: boolean) => void;
  onToggleTask: (id: string) => void;
  setTaskText: (value: string) => void;
  taskText: string;
  tasks: Task[];
  totalCount: number;
};

export function TaskDashboard({
  completedCount,
  intro,
  isTaskInputFocused,
  onAddTask,
  onDeleteTask,
  onLogout,
  onTaskInputFocusChange,
  onToggleTask,
  setTaskText,
  taskText,
  tasks,
  totalCount,
}: TaskDashboardProps) {
  const mascotVisibility = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(mascotVisibility, {
      toValue: isTaskInputFocused ? 0 : 1,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [isTaskInputFocused, mascotVisibility]);

  return (
    <Animated.View
      style={[
        styles.screen,
        {
          opacity: intro,
          transform: [
            {
              translateY: intro.interpolate({
                inputRange: [0, 1],
                outputRange: [22, 0],
              }),
            },
          ],
        },
      ]}>
      <Animated.View
        pointerEvents={isTaskInputFocused ? 'none' : 'auto'}
        style={[
          styles.logoutButton,
          {
            opacity: mascotVisibility,
            transform: [
              {
                translateY: mascotVisibility.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-12, 0],
                }),
              },
              {
                scale: mascotVisibility.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.92, 1],
                }),
              },
            ],
          },
        ]}>
        <Pressable
          accessibilityLabel="Log out"
          accessibilityRole="button"
          hitSlop={10}
          onPress={onLogout}
          style={({ pressed }) => [styles.logoutButtonTapTarget, pressed && styles.pressed]}>
          <Feather
            name="log-out"
            size={20}
            color={palette.ink}
            style={styles.logoutIcon}
          />
        </Pressable>
      </Animated.View>
      <Animated.View
        style={[
          styles.mascotCollapsible,
          {
            height: mascotVisibility.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 306],
            }),
            opacity: mascotVisibility,
            transform: [
              {
                translateY: mascotVisibility.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-28, 0],
                }),
              },
            ],
          },
        ]}>
        <MascotCounter completedCount={completedCount} totalCount={totalCount} />
      </Animated.View>
      {tasks.length === 0 ? (
        <Animated.View
          style={[
            styles.focusStateCollapsible,
            {
              height: mascotVisibility.interpolate({
                inputRange: [0, 1],
                outputRange: [306, 0],
              }),
              opacity: mascotVisibility.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
              transform: [
                {
                  translateY: mascotVisibility.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -16],
                  }),
                },
              ],
            },
          ]}>
          <View style={styles.focusStateCard}>
            <Text style={styles.focusStateTitle}>Ready when you are</Text>
            <Text style={styles.focusStateSubtitle}>
              Add your next task below and keep the momentum going.
            </Text>
          </View>
        </Animated.View>
      ) : null}
      <ScrollView
        contentContainerStyle={styles.taskScrollContent}
        keyboardShouldPersistTaps="handled"
        directionalLockEnabled
        showsVerticalScrollIndicator={false}>
        <TaskSection
          onDelete={onDeleteTask}
          onToggle={onToggleTask}
          tasks={tasks}
        />
      </ScrollView>
      <TaskComposer
        onAddTask={onAddTask}
        onFocusChange={onTaskInputFocusChange}
        setTaskText={setTaskText}
        taskText={taskText}
      />
    </Animated.View>
  );
}
