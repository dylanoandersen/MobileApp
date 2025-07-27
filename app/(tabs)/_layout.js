import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="orders"
          options={{
            title: 'Orders',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="suitcase.fill" color={color} />,
            listeners: () => ({
              tabPress: (e) => {
                // Prevent default behavior
                e.preventDefault();
                // Navigate to the orders screen
                router.replace('/(tabs)/orders/ordersList');
              },
            }),
          }}
        />
        <Tabs.Screen
          name="employees"
          options={{
            title: 'Employees',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
            listeners: () => ({
              tabPress: (e) => {
                // Prevent default behavior
                e.preventDefault();
                // Navigate to the employees screen
                router.replace('/(tabs)/employees/employeesList');
              },
            }),
          }}
        />
      </Tabs>
    </>
  );
}
