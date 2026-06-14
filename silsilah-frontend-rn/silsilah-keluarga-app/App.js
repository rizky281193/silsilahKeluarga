import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/pages/HomeScreen';
import MembersPage from './src/pages/MembersPage';
import { Home, Network } from 'lucide-react-native'; // <-- Import Ikon Premium

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#2f54eb', // Ubah warna aktif menjadi Royal Blue Premium agar senada
          tabBarInactiveTintColor: '#a2a2a7',
          tabBarStyle: {
            height: 65,
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#f0f5ff', // Pemisah tipis pastel
            paddingBottom: 8,
            paddingTop: 8,
            shadowColor: '#002c8c',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.03,
            shadowRadius: 10,
            elevation: 5,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
            marginTop: 4,
          },
          headerShown: false,
        }}
      >
        {/* TAB BERANDA */}
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Beranda',
            tabBarIcon: ({ color, size }) => (
              <Home color={color} size={22} />
            ),
          }}
        />

        {/* TAB SILSILAH */}
        <Tab.Screen
          name="Silsilah"
          component={MembersPage}
          options={{
            tabBarLabel: 'Silsilah',
            tabBarIcon: ({ color, size }) => (
              <Network color={color} size={22} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}