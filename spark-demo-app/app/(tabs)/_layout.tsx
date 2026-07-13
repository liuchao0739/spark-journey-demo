import { Tabs } from 'expo-router';
import { Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '@/constants/theme';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const map: Record<string, [object, object]> = {
    today: [
      require('@/assets/images/tab-today-default.png'),
      require('@/assets/images/tab-today-active.png'),
    ],
    journey: [
      require('@/assets/images/tab-journey-default.png'),
      require('@/assets/images/tab-journey-active.png'),
    ],
    explore: [
      require('@/assets/images/tab-explore-default.png'),
      require('@/assets/images/tab-explore-active.png'),
    ],
    companion: [
      require('@/assets/images/tab-companion-default.png'),
      require('@/assets/images/tab-companion-active.png'),
    ],
    profile: [
      require('@/assets/images/tab-profile-default.png'),
      require('@/assets/images/tab-profile-active.png'),
    ],
  };
  const [def, active] = map[name];
  return (
    <Image
      source={focused ? active : def}
      style={{ width: 28, height: 28, opacity: focused ? 1 : 0.55 }}
      resizeMode="contain"
    />
  );
}

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: 72,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: t('tabs.today'),
          tabBarIcon: ({ focused }) => <TabIcon name="today" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: t('tabs.journey'),
          tabBarIcon: ({ focused }) => <TabIcon name="journey" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: t('tabs.explore'),
          tabBarIcon: ({ focused }) => <TabIcon name="explore" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="companion"
        options={{
          title: t('tabs.companion'),
          tabBarIcon: ({ focused }) => <TabIcon name="companion" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
