import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    KeyboardAvoidingView,
    LayoutAnimation,
    Platform,
    UIManager,
    View,
} from 'react-native';
import 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoginScreen } from '@/components/todo/login-screen';
import { styles } from '@/components/todo/styles';
import { TaskDashboard } from '@/components/todo/task-dashboard';
import { initialTasks } from '@/constants/todo';
import type { Task } from '@/types/task';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const getUserTaskKey = (value: string) => value.trim().toLowerCase();
const taskStorageKey = 'taskcoon.tasksByUser';

export default function App() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [activeTaskKey, setActiveTaskKey] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isTaskInputFocused, setIsTaskInputFocused] = useState(false);
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState(initialTasks);
  const [tasksByUser, setTasksByUser] = useState<Record<string, Task[]>>({});
  const [hasLoadedSavedTasks, setHasLoadedSavedTasks] = useState(false);
  const intro = useRef(new Animated.Value(0)).current;

  const completedCount = tasks.filter((task) => task.completed).length;

  useEffect(() => {
    Animated.timing(intro, {
      toValue: 1,
      duration: 720,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [intro]);

  useEffect(() => {
    const loadSavedTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem(taskStorageKey);

        if (savedTasks) {
          setTasksByUser(JSON.parse(savedTasks) as Record<string, Task[]>);
        }
      } catch {
        setTasksByUser({});
      } finally {
        setHasLoadedSavedTasks(true);
      }
    };

    void loadSavedTasks();
  }, []);

  useEffect(() => {
    if (!hasLoadedSavedTasks) {
      return;
    }

    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem(taskStorageKey, JSON.stringify(tasksByUser));
      } catch {
        // Storage is best-effort in development runtimes where the native module may be unavailable.
      }
    };

    void saveTasks();
  }, [hasLoadedSavedTasks, tasksByUser]);

  const animateLayout = () => {
    LayoutAnimation.configureNext({
      duration: 320,
      create: { type: 'easeInEaseOut', property: 'opacity' },
      update: { type: 'spring', springDamping: 0.76 },
      delete: { type: 'easeInEaseOut', property: 'opacity' },
    });
  };

  const handleLogin = () => {
    const taskKey = getUserTaskKey(username);

    if (!taskKey || !password.trim()) {
      return;
    }

    Animated.timing(intro, {
      toValue: 0,
      duration: 180,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setActiveTaskKey(taskKey);
      setTasks(tasksByUser[taskKey] ?? initialTasks);
      setIsAuthed(true);
      intro.setValue(0);
      Animated.timing(intro, {
        toValue: 1,
        duration: 620,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
  };

  const updateActiveTasks = (getNextTasks: (currentTasks: Task[]) => Task[]) => {
    setTasks((currentTasks) => {
      const nextTasks = getNextTasks(currentTasks);

      if (activeTaskKey) {
        setTasksByUser((currentTasksByUser) => ({
          ...currentTasksByUser,
          [activeTaskKey]: nextTasks,
        }));
      }

      return nextTasks;
    });
  };

  const addTask = () => {
    const title = taskText.trim();

    if (!title) {
      return;
    }

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    animateLayout();
    updateActiveTasks((currentTasks) => [
      {
        id: `${Date.now()}`,
        title,
        completed: false,
        createdAt: new Date().toISOString(),
      },
      ...currentTasks,
    ]);
    setTaskText('');
  };

  const toggleTask = (id: string) => {
    const task = tasks.find((currentTask) => currentTask.id === id);

    if (task?.completed) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    animateLayout();
    updateActiveTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const updateTaskDescription = (id: string, description: string) => {
    updateActiveTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, description } : task,
      ),
    );
  };

  const deleteTask = (id: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    animateLayout();
    updateActiveTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  };

  const reorderTasks = (reorderedTasks: Task[]) => {
    updateActiveTasks(() => reorderedTasks);
  };

  const handleLogout = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.timing(intro, {
      toValue: 0,
      duration: 180,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setIsAuthed(false);
      setActiveTaskKey('');
      setPassword('');
      setTaskText('');
      setIsTaskInputFocused(false);
      intro.setValue(0);
      Animated.timing(intro, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isAuthed ? (
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: 'padding', default: undefined })}
          style={styles.keyboardView}>
          <TaskDashboard
            completedCount={completedCount}
            intro={intro}
            isTaskInputFocused={isTaskInputFocused}
            onAddTask={addTask}
            onDeleteTask={deleteTask}
            onLogout={handleLogout}
            onReorderTasks={reorderTasks}
            onTaskInputFocusChange={setIsTaskInputFocused}
            onToggleTask={toggleTask}
            onUpdateTaskDescription={updateTaskDescription}
            setTaskText={setTaskText}
            taskText={taskText}
            tasks={tasks}
            totalCount={tasks.length}
          />
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.keyboardView}>
          <LoginScreen
            intro={intro}
            onLogin={handleLogin}
            password={password}
            setPassword={setPassword}
            setUsername={setUsername}
            username={username}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
