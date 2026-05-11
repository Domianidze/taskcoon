import { Feather } from '@expo/vector-icons';
import { memo, useEffect, useRef, useState } from 'react';
import { Animated as RNAnimated, Easing, Pressable, Text, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { palette } from '@/constants/todo-theme';
import type { Task } from '@/types/task';

import { styles } from './styles';

type TaskRowProps = {
  isDragging?: boolean;
  onDelete: (id: string) => void;
  onDrag: () => void;
  onOpen: (id: string) => void;
  onToggle: (id: string) => void;
  task: Task;
};

function TaskRowComponent({
  isDragging = false,
  onDelete,
  onDrag,
  onOpen,
  onToggle,
  task,
}: TaskRowProps) {
  const checkScale = useRef(new RNAnimated.Value(task.completed ? 1 : 0)).current;
  const exitProgress = useRef(new RNAnimated.Value(0)).current;
  const [isDeleting, setIsDeleting] = useState(false);
  const [rowHeight, setRowHeight] = useState(0);

  useEffect(() => {
    RNAnimated.spring(checkScale, {
      toValue: task.completed ? 1 : 0,
      friction: 5,
      tension: 130,
      useNativeDriver: true,
    }).start();
  }, [checkScale, task.completed]);

  const handleDelete = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleting(true);
    RNAnimated.timing(exitProgress, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        onDelete(task.id);
      }
    });
  };

  const exitStyle = {
    maxHeight:
      isDeleting && rowHeight
        ? exitProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [rowHeight, 0],
          })
        : undefined,
    opacity: exitProgress.interpolate({
      inputRange: [0, 0.82, 1],
      outputRange: [1, 0, 0],
    }),
    transform: [
      {
        translateX: exitProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -28],
        }),
      },
      {
        scale: exitProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.96],
        }),
      },
    ],
  };

  return (
    <RNAnimated.View
      onLayout={(event) => {
        if (!isDeleting) {
          setRowHeight(event.nativeEvent.layout.height);
        }
      }}
      pointerEvents={isDeleting ? 'none' : 'auto'}
      style={[styles.taskExitWrap, exitStyle]}>
      <ReanimatedSwipeable
        enabled={!isDragging}
        friction={1.12}
        dragOffsetFromRightEdge={4}
        enableTrackpadTwoFingerGesture
        overshootFriction={8}
        overshootRight
        rightThreshold={28}
        animationOptions={{
          damping: 20,
          mass: 0.75,
          overshootClamping: false,
          stiffness: 190,
        }}
        containerStyle={styles.taskSwipeWrap}
        renderRightActions={(progress) => (
          <DeleteAction onPress={handleDelete} progress={progress} />
        )}>
        <Pressable
          accessibilityRole="button"
          delayLongPress={140}
          onLongPress={onDrag}
          onPress={() => {
            if (!isDeleting) {
              onOpen(task.id);
            }
          }}
          style={[
            styles.taskRow,
            task.completed && styles.taskRowCompleted,
            isDragging && styles.taskRowDragging,
          ]}>
          <View style={styles.taskContent}>
            <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
              {task.title}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.taskMeta,
                !task.description?.trim() && styles.taskMetaHint,
              ]}>
              {task.description?.trim() || 'Tap to add a description'}
            </Text>
          </View>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: task.completed }}
            hitSlop={8}
            onPress={() => onToggle(task.id)}
            style={[styles.checkbox, task.completed && styles.checkboxCompleted]}>
            <RNAnimated.View
              style={[
                styles.checkmarkWrap,
                {
                  opacity: checkScale,
                  transform: [{ scale: checkScale }],
                },
              ]}>
              <Feather name="check" size={19} color={palette.white} />
            </RNAnimated.View>
          </Pressable>
        </Pressable>
      </ReanimatedSwipeable>
    </RNAnimated.View>
  );
}

export const TaskRow = memo(TaskRowComponent, (previous, next) => (
  previous.isDragging === next.isDragging &&
  previous.task.completed === next.task.completed &&
  previous.task.createdAt === next.task.createdAt &&
  previous.task.description === next.task.description &&
  previous.task.id === next.task.id &&
  previous.task.title === next.task.title
));

function DeleteAction({
  onPress,
  progress,
}: {
  onPress: () => void;
  progress: SharedValue<number>;
}) {
  const iconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.45, 1], [0, 0.85, 1]),
    transform: [
      {
        scale: interpolate(progress.value, [0, 1], [0.72, 1]),
      },
    ],
  }));

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.deleteReveal}>
      <Reanimated.View style={[styles.deleteIconBubble, iconStyle]}>
        <Feather name="trash-2" size={16} color={palette.white} />
      </Reanimated.View>
    </Pressable>
  );
}
