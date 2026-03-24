import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  date: string;
  description: string;
}

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Fetch balance
    await new Promise(resolve => setTimeout(resolve, 1000));
    setBalance(125000); // Demo balance
    setRefreshing(false);
  };

  useEffect(() => {
    onRefresh();
  }, []);

  const quickActions = [
    { icon: 'add-circle', label: 'Fund Wallet', screen: 'Deposit' },
    { icon: 'swap-horizontal', label: 'Transfer', screen: 'Transfer' },
    { icon: 'call', label: 'Airtime', screen: 'Airtime' },
    { icon: 'receipt', label: 'Bills', screen: 'Bills' },
  ];

  const recentTransactions: Transaction[] = [
    { id: '1', type: 'credit', amount: 5000, status: 'success', date: 'Today', description: 'From John Doe' },
    { id: '2', type: 'debit', amount: 2000, status: 'success', date: 'Yesterday', description: 'MTN Airtime' },
    { id: '3', type: 'debit', amount: 15000, status: 'success', date: 'Mar 20', description: 'To Sarah' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.firstName || 'User'} 👋</Text>
            <Text style={styles.accountStatus}>Account Active</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={24} color={Colors.text.white} />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>₦{balance.toLocaleString()}</Text>
          <View style={styles.accountInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="shield-checkmark" size={16} color={Colors.secondary} />
              <Text style={styles.infoText}> insured</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionItem}
              onPress={() => action.screen === 'Deposit' ? navigation.navigate('Deposit') : navigation.navigate(action.screen)}
            >
              <View style={styles.actionIcon}>
                <Ionicons name={action.icon as any} size={24} color={Colors.primary} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.map((tx) => (
            <View key={tx.id} style={styles.transactionItem}>
              <View style={[styles.txIcon, tx.type === 'credit' ? styles.creditIcon : styles.debitIcon]}>
                <Ionicons 
                  name={tx.type === 'credit' ? 'arrow-down' : 'arrow-up'} 
                  size={16} 
                  color={tx.type === 'credit' ? Colors.success : Colors.error} 
                />
              </View>
              <View style={styles.txDetails}>
                <Text style={styles.txDescription}>{tx.description}</Text>
                <Text style={styles.txDate}>{tx.date}</Text>
              </View>
              <Text style={[styles.txAmount, tx.type === 'credit' ? styles.creditAmount : styles.debitAmount]}>
                {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
              </Text>
            </View>
          ))}
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
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
    borderBottomLeftRadius: BorderRadius.xxl,
    borderBottomRightRadius: BorderRadius.xxl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.text.white,
    marginBottom: Spacing.xs,
  },
  accountStatus: {
    fontSize: FontSizes.sm,
    color: Colors.secondary,
  },
  balanceCard: {
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.lg,
    marginTop: -Spacing.xl,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.white + '80',
    marginBottom: Spacing.xs,
  },
  balanceAmount: {
    fontSize: FontSizes.xxxl,
    fontWeight: '700',
    color: Colors.text.white,
    marginBottom: Spacing.sm,
  },
  accountInfo: {
    flexDirection: 'row',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    color: Colors.secondary,
    fontSize: FontSizes.xs,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    marginTop: Spacing.lg,
  },
  actionItem: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  actionLabel: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  seeAll: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  creditIcon: {
    backgroundColor: Colors.success + '20',
  },
  debitIcon: {
    backgroundColor: Colors.error + '20',
  },
  txDetails: {
    flex: 1,
  },
  txDescription: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  txDate: {
    fontSize: FontSizes.xs,
    color: Colors.text.light,
  },
  txAmount: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  creditAmount: {
    color: Colors.success,
  },
  debitAmount: {
    color: Colors.error,
  },
});