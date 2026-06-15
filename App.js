import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'; 
import HomeScreen from './src/pages/HomeScreen';
import MembersPage from './src/pages/MembersPage';
import LoginScreen from './src/pages/LoginScreen'; 
import { Home, Network, Settings } from 'lucide-react-native'; // <-- Tambah ikon Settings
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { supabase } from './src/config/supabase'; // <-- Import Supabase untuk pantau session global
import AdminMembersPage from './src/pages/AdminMembersPage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator(); 

function NavigationTabs() {
  const insets = useSafeAreaInsets();
  const [isAdmin, setIsAdmin] = useState(false); // <-- State pantau admin untuk menu bar

  useEffect(() => {
    // Cek status saat aplikasi pertama dimuat
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase.from('user_roles').select('role').eq('email', session.user.email.toLowerCase()).single();
        setIsAdmin(data?.role === 'ADMIN');
      }
    }
    checkSession();

    // Dengarkan perubahan login/logout secara real-time
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data } = await supabase.from('user_roles').select('role').eq('email', session.user.email.toLowerCase()).single();
        setIsAdmin(data?.role === 'ADMIN');
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2f54eb', 
        tabBarInactiveTintColor: '#a2a2a7',
        tabBarStyle: {
          minHeight: 65, 
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f0f5ff', 
          paddingBottom: insets.bottom > 0 ? insets.bottom + 4 : 10,
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
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Beranda',
          tabBarIcon: ({ color }) => <Home color={color} size={22} />,
        }}
      />
      
      <Tab.Screen
        name="Silsilah"
        component={isAdmin ? AdminMembersPage : MembersPage} // <-- KUNCI SUKSES PENGALIHAN PAGE!
        options={{
          tabBarLabel: isAdmin ? 'Data Silsilah' : 'Silsilah',
          tabBarIcon: ({ color }) => (
            isAdmin ? <Settings color={color} size={22} /> : <Network color={color} size={22} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={NavigationTabs} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}