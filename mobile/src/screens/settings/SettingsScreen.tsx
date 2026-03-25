import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

export default function SettingsScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [biometric, setBiometric] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Appearance / Theme */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Appearance</Text>
          <TouchableOpacity 
            style={[styles.settingsCard, { backgroundColor: theme.surface }]}
            onPress={() => navigation.navigate('ThemeSettings')}
          >
            <View style={styles.settingItem}>
              <View style={[styles.settingIcon, { backgroundColor: theme.accent + '20' }]}>
                <Ionicons name="color-palette" size={20} color={theme.accent} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: theme.text }]}>Theme</Text>
                <Text style={[styles.settingDesc, { color: theme.textMuted }]}>Choose your app theme</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Security */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Security</Text>
          <View style={[styles.settingsCard, { backgroundColor: theme.surface }]}>
            <View style={styles.settingItem}>
              <View style={[styles.settingIcon, { backgroundColor: theme.accent + '20' }]}>
                <Ionicons name="finger-print" size={20} color={theme.accent} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: theme.text }]}>Biometric Unlock</Text>
                <Text style={[styles.settingDesc, { color: theme.textMuted }]}>Use fingerprint or face ID</Text>
              </View>
              <Switch 
                value={biometric} 
                onValueChange={setBiometric} 
                trackColor={{ true: theme.accent, false: theme.border }}
                thumbColor="#fff"
              />
            </View>
            <View style={[styles.settingItem, { borderBottomWidth: 0 }]}>
              <View style={[styles.settingIcon, { backgroundColor: theme.accent + '20' }]}>
                <Ionicons name="key" size={20} color={theme.accent} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: theme.text }]}>Change PIN</Text>
                <Text style={[styles.settingDesc, { color: theme.textMuted }]}>Update transaction PIN</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Notifications</Text>
          <View style={[styles.settingsCard, { backgroundColor: theme.surface }]}>
            <View style={[styles.settingItem, { borderBottomWidth: 0 }]}>
              <View style={[styles.settingIcon, { backgroundColor: theme.accent + '20' }]}>
                <Ionicons name="notifications" size={20} color={theme.accent} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: theme.text }]}>Push Notifications</Text>
                <Text style={[styles.settingDesc, { color: theme.textMuted }]}>Transaction alerts</Text>
              </View>
              <Switch 
                value={notifications} 
                onValueChange={setNotifications} 
                trackColor={{ true: theme.accent, false: theme.border }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>About</Text>
          <View style={[styles.settingsCard, { backgroundColor: theme.surface }]}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={[styles.settingIcon, { backgroundColor: theme.accent + '20' }]}>
                <Ionicons name="document-text" size={20} color={theme.accent} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: theme.text }]}>Terms of Service</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <View style={[styles.settingIcon, { backgroundColor: theme.accent + '20' }]}>
                <Ionicons name="shield-checkmark" size={20} color={theme.accent} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: theme.text }]}>Privacy Policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.settingItem, { borderBottomWidth: 0 }]}>
              <View style={[styles.settingIcon, { backgroundColor: theme.accent + '20' }]}>
                <Ionicons name="information-circle" size={20} color={theme.accent} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: theme.text }]}>App Version</Text>
                <Text style={[styles.settingDesc, { color: theme.textMuted }]}>1.0.0</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Onboarding Replay */}
        <View style={styles.section}>
          <TouchableOpacity style={[styles.replayButton, { backgroundColor: theme.surface }]}>
            <Ionicons name="refresh" size={20} color={theme.accent} />
            <Text style={[styles.replayText, { color: theme.accent }]}>Replay Onboarding</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontSize: 18, fontWeight: '600' },
  section: { paddingHorizontal: 20, paddingTop: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 10 },
  settingsCard: { borderRadius: 16, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  settingIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  settingContent: { flex: 1 },
  settingLabel: { fontSize: 15, fontWeight: '500' },
  settingDesc: { fontSize: 12, marginTop: 2 },
  replayButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, gap: 10 },
  replayText: { fontSize: 15, fontWeight: '600' },
});