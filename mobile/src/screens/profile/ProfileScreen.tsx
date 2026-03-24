import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: 'person', label: 'Personal Information', screen: 'PersonalInfo' },
    { icon: 'document-text', label: 'KYC Verification', screen: 'KYC' },
    { icon: 'shield-checkmark', label: 'Security', screen: 'Security' },
    { icon: 'notifications', label: 'Notifications', screen: 'Notifications' },
    { icon: 'help-circle', label: 'Help & Support', screen: 'Support' },
    { icon: 'document-text-outline', label: 'Terms & Privacy', screen: 'Terms' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.firstName?.[0] || 'U'}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.firstName || 'User'} {user?.lastName || ''}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'user@nerra.com'}</Text>
            <View style={styles.kycBadge}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
              <Text style={styles.kycText}>KYC Verified</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Beneficiaries</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Cards</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon as any} size={20} color={Colors.primary} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.light} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.md },
  title: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.text.primary },
  profileCard: { flexDirection: 'row', alignItems: 'center', margin: Spacing.lg, padding: Spacing.lg, backgroundColor: Colors.surface, borderRadius: BorderRadius.xl },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: FontSizes.xxl, fontWeight: '700', color: Colors.text.white },
  profileInfo: { marginLeft: Spacing.md, flex: 1 },
  profileName: { fontSize: FontSizes.lg, fontWeight: '600', color: Colors.text.primary },
  profileEmail: { fontSize: FontSizes.sm, color: Colors.text.secondary, marginTop: Spacing.xs },
  kycBadge: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.xs, gap: Spacing.xs },
  kycText: { fontSize: FontSizes.xs, color: Colors.success },
  statsContainer: { flexDirection: 'row', marginHorizontal: Spacing.lg, padding: Spacing.lg, backgroundColor: Colors.surface, borderRadius: BorderRadius.xl },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.primary },
  statLabel: { fontSize: FontSizes.xs, color: Colors.text.secondary, marginTop: Spacing.xs },
  statDivider: { width: 1, backgroundColor: Colors.divider },
  menuSection: { margin: Spacing.lg, backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, padding: Spacing.md },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  menuIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary + '10', alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  menuLabel: { flex: 1, fontSize: FontSizes.md, color: Colors.text.primary },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: Spacing.lg, padding: Spacing.md, gap: Spacing.sm },
  logoutText: { fontSize: FontSizes.md, color: Colors.error, fontWeight: '600' },
});