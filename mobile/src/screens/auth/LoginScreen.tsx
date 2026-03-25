import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../../components/common/Button';

export default function LoginScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      // Simulate login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const demoUser = {
        id: '1',
        publicUserId: 'NERRA-' + Date.now(),
        email: email,
        firstName: email.split('@')[0],
        lastName: 'User',
        kycTier: 0,
        status: 'active',
      };
      
      const demoToken = 'demo_token_' + Date.now();
      await SecureStore.setItemAsync('auth_token', demoToken);
      await AsyncStorage.setItem('user_data', JSON.stringify(demoUser));
      
      // Navigate to main app
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Simulate Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const demoUser = {
        id: '1',
        publicUserId: 'NERRA-GOOGLE',
        email: 'user@gmail.com',
        firstName: 'Google',
        lastName: 'User',
        kycTier: 0,
        status: 'active',
      };
      
      const demoToken = 'demo_token_' + Date.now();
      await SecureStore.setItemAsync('auth_token', demoToken);
      await AsyncStorage.setItem('user_data', JSON.stringify(demoUser));
      
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error) {
      Alert.alert('Error', 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    try {
      // Simulate Apple OAuth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const demoUser = {
        id: '1',
        publicUserId: 'NERRA-APPLE',
        email: 'user@icloud.com',
        firstName: 'Apple',
        lastName: 'User',
        kycTier: 0,
        status: 'active',
      };
      
      const demoToken = 'demo_token_' + Date.now();
      await SecureStore.setItemAsync('auth_token', demoToken);
      await AsyncStorage.setItem('user_data', JSON.stringify(demoUser));
      
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error) {
      Alert.alert('Error', 'Apple sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={[styles.logo, { color: theme.primary }]}>Nerra</Text>
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>Welcome back</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text }]}>Email</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={theme.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text }]}>Password</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={theme.textMuted}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity>
              <Text style={[styles.forgotPasswordText, { color: theme.accent }]}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              size="large"
              style={styles.loginButton}
            />
          </View>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            <Text style={[styles.dividerText, { color: theme.textMuted }]}>or continue with</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity 
              style={[styles.socialButton, { backgroundColor: theme.surface, borderColor: theme.border }]} 
              onPress={handleGoogleLogin}
              disabled={loading}
            >
              <View style={styles.googleIcon}>
                <Text style={styles.socialIconText}>G</Text>
              </View>
              <Text style={[styles.socialText, { color: theme.text }]}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.socialButton, { backgroundColor: theme.surface, borderColor: theme.border }]} 
              onPress={handleAppleLogin}
              disabled={loading}
            >
              <View style={styles.appleIcon}>
                <Text style={styles.appleIconText}></Text>
              </View>
              <Text style={[styles.socialText, { color: theme.text }]}>Apple</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.textMuted }]}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={[styles.signUpText, { color: theme.accent }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 48 },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 36, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 18 },
  form: { marginBottom: 24 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16 },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotPasswordText: { fontSize: 14 },
  loginButton: { marginTop: 10 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 16, fontSize: 14 },
  socialButtons: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 32 },
  socialButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 24, gap: 8, minWidth: 130, justifyContent: 'center' },
  googleIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  socialIconText: { fontSize: 16, fontWeight: '700', color: '#4285F4' },
  appleIcon: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  appleIconText: { fontSize: 20 },
  socialIcon: { fontSize: 18 },
  socialText: { fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 32 },
  footerText: { fontSize: 16 },
  signUpText: { fontSize: 16, fontWeight: '600' },
});
