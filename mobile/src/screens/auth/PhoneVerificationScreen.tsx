import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import Button from '../../components/common/Button';

export default function PhoneVerificationScreen({ navigation, route }: any) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('otp');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!code || code.length < 4) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    setLoading(true);
    try {
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigation.navigate('CreatePin');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Verification failed');
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
            {step === 'phone' ? 'Verify Phone Number' : 'Enter OTP'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 'phone' 
              ? 'We\'ll send a verification code to your phone' 
              : 'Enter the 6-digit code sent to your phone'
            }
          </Text>

          {step === 'phone' ? (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="+234 800 000 0000"
                keyboardType="phone-pad"
                autoComplete="tel"
              />
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Verification Code</Text>
              <TextInput
                style={styles.input}
                value={code}
                onChangeText={setCode}
                placeholder="123456"
                keyboardType="number-pad"
                maxLength={6}
              />
              <TouchableOpacity onPress={() => setStep('phone')}>
                <Text style={styles.resendText}>Change phone number</Text>
              </TouchableOpacity>
            </View>
          )}

          <Button
            title={step === 'phone' ? 'Send Code' : 'Verify'}
            onPress={step === 'phone' ? handleSendOtp : handleVerifyOtp}
            loading={loading}
            size="large"
            style={styles.button}
          />

          {step === 'otp' && (
            <TouchableOpacity style={styles.resendContainer}>
              <Text style={styles.resendLabel}>Didn't receive code? </Text>
              <Text style={styles.resendLink}>Resend</Text>
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
    marginBottom: Spacing.lg,
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
    paddingVertical: Spacing.md,
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
  },
  resendText: {
    color: Colors.primary,
    fontSize: FontSizes.sm,
    marginTop: Spacing.sm,
  },
  button: {
    marginTop: Spacing.md,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  resendLabel: {
    color: Colors.text.secondary,
    fontSize: FontSizes.md,
  },
  resendLink: {
    color: Colors.primary,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});