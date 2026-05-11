import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    KeyboardAvoidingView,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoginScreen } from '@/components/todo/login-screen';
import { styles } from '@/components/todo/styles';
import { TaskDashboard } from '@/components/todo/task-dashboard';
import { initialTasks } from '@/constants/todo';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isTaskInputFocused, setIsTaskInputFocused] = useState(false);
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState(initialTasks);
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

  const animateLayout = () => {
    LayoutAnimation.configureNext({
      duration: 320,
      create: { type: 'easeInEaseOut', property: 'opacity' },
      update: { type: 'spring', springDamping: 0.76 },
      delete: { type: 'easeInEaseOut', property: 'opacity' },
    });
  };

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      return;
    }

    Animated.timing(intro, {
      toValue: 0,
      duration: 180,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
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

  const addTask = () => {
    const title = taskText.trim();

    if (!title) {
      return;
    }

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    animateLayout();
    setTasks((currentTasks) => [
      {
        id: `${Date.now()}`,
        title,
        completed: false,
        createdAt: 'Just now',
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
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (id: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    animateLayout();
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
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
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', default: undefined })}
        style={styles.keyboardView}>
        {isAuthed ? (
          <TaskDashboard
            completedCount={completedCount}
            intro={intro}
            isTaskInputFocused={isTaskInputFocused}
            onAddTask={addTask}
            onDeleteTask={deleteTask}
            onLogout={handleLogout}
            onTaskInputFocusChange={setIsTaskInputFocused}
            onToggleTask={toggleTask}
            setTaskText={setTaskText}
            taskText={taskText}
            tasks={tasks}
            totalCount={tasks.length}
          />
        ) : (
          <LoginScreen
            intro={intro}
            onLogin={handleLogin}
            password={password}
            setPassword={setPassword}
            setUsername={setUsername}
            username={username}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
