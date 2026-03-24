import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';

export default function SettingsScreen({ navigation }: any) {
  const [biometric, setBiometric] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Ionicons name="finger-print" size={20} color={Colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Biometric Unlock</Text>
                <Text style={styles.settingDesc}>Use fingerprint or face ID</Text>
              </View>
              <Switch value={biometric} onValueChange={setBiometric} trackColor={{ true: Colors.primary }} />
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Ionicons name="key" size={20} color={Colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Change PIN</Text>
                <Text style={styles.settingDesc}>Update transaction PIN</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.light} />
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Ionicons name="lock-closed" size={20} color={Colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Change Password</Text>
                <Text style={styles.settingDesc}>Update account password</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.light} />
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Ionicons name="notifications" size={20} color={Colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Text style={styles.settingDesc}>Transaction alerts</Text>
              </View>
              <Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: Colors.primary }} />
            </View>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Ionicons name="document-text" size={20} color={Colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Terms of Service</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.light} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Privacy Policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.light} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Ionicons name="information-circle" size={20} color={Colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>App Version</Text>
                <Text style={styles.settingDesc}>1.0.0</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Onboarding Replay */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.replayButton}>
            <Ionicons name="refresh" size={20} color={Colors.primary} />
            <Text style={styles.replayText}>Replay Onboarding</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  title: { fontSize: FontSizes.lg, fontWeight: '600', color: Colors.text.primary },
  section: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  sectionTitle: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.text.secondary, marginBottom: Spacing.sm, textTransform: 'uppercase' },
  settingsCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, padding: Spacing.md },
  settingItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  settingIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary + '10', alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  settingContent: { flex: 1 },
  settingLabel: { fontSize: FontSizes.md, color: Colors.text.primary },
  settingDesc: { fontSize: FontSizes.sm, color: Colors.text.secondary, marginTop: 2 },
  replayButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: Spacing.md, backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, gap: Spacing.sm },
  replayText: { fontSize: FontSizes.md, color: Colors.primary, fontWeight: '600' },
});