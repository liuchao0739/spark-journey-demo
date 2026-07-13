import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '@/context/AppContext';
import '@/i18n';

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#1a1a1a' } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="lesson/[id]/intro" />
        <Stack.Screen name="lesson/[id]/read" />
        <Stack.Screen name="lesson/[id]/complete" />
      </Stack>
    </AppProvider>
  );
}
