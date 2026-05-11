import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
  useFonts,
} from '@expo-google-fonts/nunito';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';


const appTheme = {
  dark: false,
  colors: {
    primary: '#1D6A5D',
    background: '#F5F1EA',
    card: '#FFFCF6',
    text: '#17201C',
    border: '#E3D8CB',
    notification: '#C56143',
  },
  fonts: {
    regular: {
      fontFamily: 'Nunito-Regular',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'Nunito-Medium',
      fontWeight: '500' as const,
    },
    bold: {
      fontFamily: 'Nunito-Bold',
      fontWeight: '700' as const,
    },
    heavy: {
      fontFamily: 'Nunito-ExtraBold',
      fontWeight: '800' as const,
    },
  },
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Nunito-Regular': Nunito_400Regular,
    'Nunito-Medium': Nunito_500Medium,
    'Nunito-SemiBold': Nunito_600SemiBold,
    'Nunito-Bold': Nunito_700Bold,
    'Nunito-ExtraBold': Nunito_800ExtraBold,
    'Nunito-Black': Nunito_900Black,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={appTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false, title: '' }} />
          </Stack>
          <StatusBar style="dark" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
