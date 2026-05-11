import { useEffect, useRef } from 'react';
import { Animated, ImageSourcePropType, Text, View } from 'react-native';

import { styles } from './styles';

type MascotCounterProps = {
  completedCount: number;
  totalCount: number;
};

const mascotStates = [
  {
    max: 0,
    label: "Let's get started!",
    image: require('@/assets/images/mascot/step1.png'),
  },
  {
    max: 2,
    label: 'Great progress, keep going!',
    image: require('@/assets/images/mascot/step2.png'),
  },
  {
    max: Number.POSITIVE_INFINITY,
    label: "You're on fire! 🔥",
    image: require('@/assets/images/mascot/step3.png'),
  },
] satisfies {
  max: number;
  label: string;
  image: ImageSourcePropType;
}[];

export function MascotCounter({ completedCount, totalCount }: MascotCounterProps) {
  const mascot = mascotStates.find((state) => completedCount <= state.max) ?? mascotStates[0];
  const taskLabel = completedCount === 1 ? 'task' : 'tasks';
  const entrance = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    entrance.setValue(0);
    Animated.spring(entrance, {
      toValue: 1,
      friction: 7,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, [entrance, mascot.label]);

  return (
    <View style={styles.mascotCard}>
      <Animated.Image
        source={mascot.image}
        style={[
          styles.mascotImage,
          {
            opacity: entrance.interpolate({
              inputRange: [0, 1],
              outputRange: [0.35, 1],
            }),
            transform: [
              {
                scale: entrance.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.92, 1],
                }),
              },
              {
                translateY: entrance.interpolate({
                  inputRange: [0, 1],
                  outputRange: [12, 0],
                }),
              },
            ],
          },
        ]}
        resizeMode="contain"
      />
      <Text style={styles.counterTitle}>
        {completedCount} {taskLabel} done
      </Text>
      <Text style={styles.counterSubtitle}>
        {totalCount ? mascot.label : "Let's get started"}
      </Text>
    </View>
  );
}
