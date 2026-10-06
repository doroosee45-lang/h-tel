import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { AuthProvider, useAuth } from './context/AuthContext';
import { colors } from './theme';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import RoomsScreen from './screens/RoomsScreen';
import RoomDetailScreen from './screens/RoomDetailScreen';
import MenuOrderScreen from './screens/MenuOrderScreen';
import ConciergeScreen from './screens/ConciergeScreen';
import BookingsScreen from './screens/BookingsScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const headerOptions = {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '700' },
};

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

const RestaurantScreen = (props) => <MenuOrderScreen {...props} type="menu" />;
const BarScreen = (props) => <MenuOrderScreen {...props} type="drink" />;
const RoomServiceScreen = (props) => <MenuOrderScreen {...props} type="menu" mode="room_service" />;

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Smart Hotel 360' }} />
      <Stack.Screen name="Rooms" component={RoomsScreen} options={{ title: 'Chambres' }} />
      <Stack.Screen name="RoomDetail" component={RoomDetailScreen} options={{ title: 'Détail chambre' }} />
      <Stack.Screen name="Restaurant" component={RestaurantScreen} options={{ title: 'Restaurant' }} />
      <Stack.Screen name="Bar" component={BarScreen} options={{ title: 'Bar' }} />
      <Stack.Screen name="RoomService" component={RoomServiceScreen} options={{ title: 'Room service' }} />
      <Stack.Screen name="Concierge" component={ConciergeScreen} options={{ title: 'Conciergerie' }} />
      <Stack.Screen name="Bookings" component={BookingsScreen} options={{ title: 'Mes réservations' }} />
    </Stack.Navigator>
  );
}

const icons = {
  HomeTab: ['home', 'home-outline'],
  BookingsTab: ['calendar', 'calendar-outline'],
  ConciergeTab: ['headset', 'headset-outline'],
  ProfileTab: ['person', 'person-outline'],
};

function MainTabs() {
  const { unreadCount } = useAuth();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...headerOptions,
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={icons[route.name][focused ? 0 : 1]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Accueil', headerShown: false }} />
      <Tab.Screen name="BookingsTab" component={BookingsScreen} options={{ title: 'Réservations' }} />
      <Tab.Screen name="ConciergeTab" component={ConciergeScreen} options={{ title: 'Conciergerie' }} />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: 'Profil', tabBarBadge: unreadCount > 0 ? unreadCount : undefined }}
      />
    </Tab.Navigator>
  );
}

function Root() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary }}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }
  return <NavigationContainer>{user ? <MainTabs /> : <AuthStack />}</NavigationContainer>;
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Root />
    </AuthProvider>
  );
}
