import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, Alert, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import Button from '../../components/common/Button';

export default function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // Demo signup - store user data
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Go directly to Create PIN (skip phone verification)
      navigation.navigate('CreatePin', { email, firstName, lastName });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      // Simulate Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('Success', 'Signed in with Google!');
      navigation.navigate('CreatePin', { email: 'user@gmail.com', firstName: 'Google', lastName: 'User' });
    } catch (error) {
      Alert.alert('Error', 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignup = async () => {
    setLoading(true);
    try {
      // Simulate Apple OAuth
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('Success', 'Signed in with Apple!');
      navigation.navigate('CreatePin', { email: 'user@icloud.com', firstName: 'Apple', lastName: 'User' });
    } catch (error) {
      Alert.alert('Error', 'Apple sign-in failed');
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Nerra today</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.nameRow}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="John"
                  autoCapitalize="words"
                  autoComplete="name-given"
                />
              </View>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Doe"
                  autoCapitalize="words"
                  autoComplete="name-family"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="john@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Create a strong password"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <Button
              title="Create Account"
              onPress={handleSignup}
              loading={loading}
              size="large"
              style={styles.signupButton}
            />
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignup}>
              <View style={styles.googleIcon}>
                <Text style={styles.socialIconText}>G</Text>
              </View>
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton} onPress={handleAppleSignup}>
              <View style={styles.appleIcon}>
                <Text style={styles.appleIconText}></Text>
              </View>
              <Text style={styles.socialText}>Apple</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.xxl + 4,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
  },
  form: {
    marginBottom: Spacing.lg,
  },
  nameRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfWidth: {
    flex: 1,
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
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  signupButton: {
    marginTop: Spacing.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    color: Colors.text.light,
    fontSize: FontSizes.sm,
    marginHorizontal: Spacing.md,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
    minWidth: 140,
    justifyContent: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIconText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4285F4',
  },
  appleIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appleIconText: {
    fontSize: 20,
    color: Colors.text.primary,
  },
  socialText: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  footerText: {
    color: Colors.text.secondary,
    fontSize: FontSizes.md,
  },
  signInText: {
    color: Colors.primary,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});