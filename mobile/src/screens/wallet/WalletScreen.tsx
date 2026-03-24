import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import Button from '../../components/common/Button';

export default function WalletScreen({ navigation }: any) {
  const [balance] = useState(125000);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Wallet</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>₦{balance.toLocaleString()}</Text>
          <View style={styles.cardActions}>
            <TouchableOpacity 
              style={styles.cardButton}
              onPress={() => navigation.navigate('Deposit')}
            >
              <Ionicons name="add-circle" size={20} color={Colors.primary} />
              <Text style={styles.cardButtonText}>Add Money</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cardButton}
              onPress={() => navigation.navigate('Transfer')}
            >
              <Ionicons name="send" size={20} color={Colors.primary} />
              <Text style={styles.cardButtonText}>Transfer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Virtual Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fund with Virtual Account</Text>
          <View style={styles.virtualAccount}>
            <View style={styles.accountRow}>
              <Text style={styles.accountLabel}>Bank</Text>
              <Text style={styles.accountValue}>Guaranty Trust Bank</Text>
            </View>
            <View style={styles.accountRow}>
              <Text style={styles.accountLabel}>Account Name</Text>
              <Text style={styles.accountValue}>Nerra Prepaid</Text>
            </View>
            <View style={styles.accountRow}>
              <Text style={styles.accountLabel}>Account Number</Text>
              <Text style={styles.accountValue}>1234567890</Text>
            </View>
            <Button
              title="Copy Account Number"
              onPress={() => {}}
              variant="outline"
              size="small"
              style={styles.copyButton}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickGrid}>
            <TouchableOpacity style={styles.quickItem}>
              <View style={styles.quickIcon}>
                <Ionicons name="qr-code" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.quickLabel}>QR Code</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickItem}>
              <View style={styles.quickIcon}>
                <Ionicons name="people" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.quickLabel}>Beneficiaries</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickItem}>
              <View style={styles.quickIcon}>
                <Ionicons name="time" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.quickLabel}>History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickItem}>
              <View style={styles.quickIcon}>
                <Ionicons name="card" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.quickLabel}>Cards</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  balanceCard: {
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  balanceLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.white + '80',
  },
  balanceAmount: {
    fontSize: FontSizes.xxxl,
    fontWeight: '700',
    color: Colors.text.white,
    marginVertical: Spacing.sm,
  },
  cardActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  cardButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
  },
  cardButtonText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  virtualAccount: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  accountLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  accountValue: {
    fontSize: FontSizes.sm,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  copyButton: {
    marginTop: Spacing.md,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  quickItem: {
    width: '47%',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  quickIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  quickLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
});