import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import Button from '../../components/common/Button';

export default function CreatePinScreen({ navigation, route }: any) {
  const { email, firstName, lastName } = route.params || {};
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [loading, setLoading] = useState(false);

  const handleCreatePin = () => {
    if (!pin || pin.length < 4 || pin.length > 6) {
      Alert.alert('Error', 'PIN must be 4-6 digits');
      return;
    }

    if (!/^\d+$/.test(pin)) {
      Alert.alert('Error', 'PIN must contain only numbers');
      return;
    }

    setStep('confirm');
  };

  const handleConfirmPin = async () => {
    if (pin !== confirmPin) {
      Alert.alert('Error', 'PINs do not match');
      setConfirmPin('');
      return;
    }

    setLoading(true);
    try {
      // Store user data locally (demo mode - in real app, this would be from backend)
      const demoUser = {
        id: '1',
        publicUserId: 'NERRA-' + Date.now(),
        email: email || 'user@nerra.app',
        firstName: firstName || 'User',
        lastName: lastName || 'Name',
        kycTier: 0,
        status: 'active',
      };
      
      // Store a demo token
      const demoToken = 'demo_token_' + Date.now();
      await SecureStore.setItemAsync('auth_token', demoToken);
      await AsyncStorage.setItem('user_data', JSON.stringify(demoUser));
      
      // Show success and navigate
      Alert.alert('Success', 'Account created successfully!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            });
          }
        }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to set PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>
            {step === 'create' ? 'Create Transaction PIN' : 'Confirm PIN'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 'create' 
              ? 'Create a 4-6 digit PIN for transactions' 
              : 'Enter your PIN again to confirm'
            }
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              {step === 'create' ? 'PIN' : 'Confirm PIN'}
            </Text>
            <TextInput
              style={styles.input}
              value={step === 'create' ? pin : confirmPin}
              onChangeText={step === 'create' ? setPin : setConfirmPin}
              placeholder="****"
              keyboardType="number-pad"
              maxLength={6}
              secureTextEntry
              autoFocus
            />
          </View>

          <View style={styles.pinGuide}>
            <Text style={styles.pinGuideText}>
              {step === 'create' 
                ? 'This PIN will be required for all transactions' 
                : 'Must match the PIN you just created'
              }
            </Text>
          </View>

          <Button
            title={step === 'create' ? 'Continue' : 'Set PIN'}
            onPress={step === 'create' ? handleCreatePin : handleConfirmPin}
            loading={loading}
            size="large"
            style={styles.button}
          />

          {step === 'confirm' && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => {
                setStep('create');
                setConfirmPin('');
              }}
            >
              <Text style={styles.backText}>Go Back</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    marginBottom: Spacing.xl,
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    fontSize: FontSizes.xl,
    color: Colors.text.primary,
    textAlign: 'center',
    letterSpacing: 16,
  },
  pinGuide: {
    backgroundColor: Colors.primary + '10',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  pinGuideText: {
    color: Colors.primary,
    fontSize: FontSizes.sm,
    textAlign: 'center',
  },
  button: {
    marginTop: Spacing.md,
  },
  backButton: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  backText: {
    color: Colors.text.secondary,
    fontSize: FontSizes.md,
  },
});