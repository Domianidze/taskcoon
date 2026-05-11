import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, Text, TextInput, View } from 'react-native';

import { LabelledInput } from './labelled-input';
import { styles } from './styles';

const loginMascot = require('@/assets/images/mascot/login.png');

type LoginScreenProps = {
  intro: Animated.Value;
  onLogin: () => void;
  password: string;
  setPassword: (value: string) => void;
  setUsername: (value: string) => void;
  username: string;
};

export function LoginScreen({
  intro,
  onLogin,
  password,
  setPassword,
  setUsername,
  username,
}: LoginScreenProps) {
  const canLogin = Boolean(username.trim() && password.trim());
  const [isLoginInputFocused, setIsLoginInputFocused] = useState(false);
  const heroVisibility = useRef(new Animated.Value(1)).current;
  const passwordInputRef = useRef<TextInput>(null);

  useEffect(() => {
    Animated.timing(heroVisibility, {
      toValue: isLoginInputFocused ? 0 : 1,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [heroVisibility, isLoginInputFocused]);

  return (
    <Animated.View
      style={[
        styles.loginShell,
        {
          justifyContent:  'center',
          marginTop: isLoginInputFocused ? 0 : -100,
          paddingTop: isLoginInputFocused ? 4 : 22,
        },
        {
          opacity: intro,
          transform: [
            {
              translateY: intro.interpolate({
                inputRange: [0, 1],
                outputRange: [28, 0],
              }),
            },
          ],
        },
      ]}>
      <Animated.View style={styles.loginHero}>
        <Animated.View
          style={{
            height: heroVisibility.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 206],
            }),
            opacity: heroVisibility,
            overflow: 'hidden',
            transform: [
              {
                translateY: heroVisibility.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          }}>
          <Animated.Image source={loginMascot} style={styles.loginMascotImage} resizeMode="contain" />
        </Animated.View>
        <Text style={styles.loginTitle}>Welcome</Text>
        <Text style={styles.loginSubtitle}>
          Keep the few things worth doing in view.
        </Text>
      </Animated.View>

      <View style={styles.loginCard}>
        <LabelledInput
          blurOnSubmit={false}
          onBlur={() => setIsLoginInputFocused(false)}
          onChangeText={setUsername}
          onFocus={() => setIsLoginInputFocused(true)}
          onSubmitEditing={() => passwordInputRef.current?.focus()}
          placeholder="Username"
          returnKeyType="next"
          value={username}
        />
        <LabelledInput
          onBlur={() => setIsLoginInputFocused(false)}
          onChangeText={setPassword}
          onFocus={() => setIsLoginInputFocused(true)}
          onSubmitEditing={onLogin}
          placeholder="Password"
          ref={passwordInputRef}
          returnKeyType="done"
          secureTextEntry
          value={password}
        />
        <Pressable
          accessibilityRole="button"
          disabled={!canLogin}
          onPress={onLogin}
          style={({ pressed }) => [
            styles.loginButton,
            !canLogin && styles.loginButtonDisabled,
            pressed && canLogin ? styles.pressed : undefined,
          ]}>
          <Text style={styles.loginButtonText}>Log in</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
