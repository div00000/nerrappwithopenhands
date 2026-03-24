import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../contexts/AuthContext';
import { Colors } from '../constants/theme';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import PhoneVerificationScreen from '../screens/auth/PhoneVerificationScreen';
import CreatePinScreen from '../screens/auth/CreatePinScreen';

// Onboarding Screens
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';

// Home Screens
import HomeScreen from '../screens/home/HomeScreen';

// Wallet Screens
import WalletScreen from '../screens/wallet/WalletScreen';
import DepositScreen from '../screens/wallet/DepositScreen';

// Transfer Screens
import TransferScreen from '../screens/transfer/TransferScreen';
import TransferConfirmScreen from '../screens/transfer/TransferConfirmScreen';

// Airtime Screens
import AirtimeScreen from '../screens/airtime/AirtimeScreen';

// Bills Screens
import BillsScreen from '../screens/bills/BillsScreen';

// Cards Screens
import CardsScreen from '../screens/cards/CardsScreen';

// Profile Screens
import ProfileScreen from '../screens/profile/ProfileScreen';

// Settings Screens
import SettingsScreen from '../screens/settings/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="PhoneVerification" component={PhoneVerificationScreen} />
      <Stack.Screen name="CreatePin" component={CreatePinScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.text.light,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Wallet':
              iconName = focused ? 'wallet' : 'wallet-outline';
              break;
            case 'Transfer':
              iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
              break;
            case 'Airtime':
              iconName = focused ? 'call' : 'call-outline';
              break;
            case 'Bills':
              iconName = focused ? 'receipt' : 'receipt-outline';
              break;
            case 'Cards':
              iconName = focused ? 'card' : 'card-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Transfer" component={TransferScreen} />
      <Tab.Screen name="Airtime" component={AirtimeScreen} />
      <Tab.Screen name="Bills" component={BillsScreen} />
      <Tab.Screen name="Cards" component={CardsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Auth" component={AuthStack} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen 
            name="Deposit" 
            component={DepositScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen 
            name="TransferConfirm" 
            component={TransferConfirmScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ presentation: 'modal' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}