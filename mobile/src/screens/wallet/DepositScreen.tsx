import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';

export default function DepositScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Money</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Virtual Account Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transfer to Virtual Account</Text>
          <View style={styles.accountCard}>
            <Text style={styles.accountLabel}>Bank</Text>
            <Text style={styles.accountValue}>Guaranty Trust Bank</Text>
            
            <Text style={styles.accountLabel}>Account Name</Text>
            <Text style={styles.accountValue}>Nerra Prepaid_ABC123</Text>
            
            <Text style={styles.accountLabel}>Account Number</Text>
            <View style={styles.accountNumberRow}>
              <Text style={styles.accountNumber}>1234567890</Text>
              <TouchableOpacity>
                <Ionicons name="copy" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.notice}>
            💡 Transfers from any bank are instant. Paste the account number to initiate transfer.
          </Text>
        </View>

        {/* Bank Transfer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bank Transfer</Text>
          <View style={styles.bankCard}>
            <View style={styles.bankLogo}>
              <Text style={styles.bankInitial}>G</Text>
            </View>
            <View style={styles.bankInfo}>
              <Text style={styles.bankName}>Guaranty Trust Bank</Text>
              <Text style={styles.bankBranch}>GTBank</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.light} />
          </View>
        </View>

        {/* Card Funding */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fund with Card</Text>
          <TouchableOpacity style={styles.cardOption}>
            <Ionicons name="card" size={24} color={Colors.primary} />
            <Text style={styles.cardOptionText}>Add Debit Card</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.light} />
          </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  accountCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  accountLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  accountValue: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    fontWeight: '500',
    marginBottom: Spacing.md,
  },
  accountNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  accountNumber: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.primary,
  },
  notice: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginTop: Spacing.md,
    lineHeight: 20,
  },
  bankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  bankLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankInitial: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text.white,
  },
  bankInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  bankName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  bankBranch: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  cardOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  cardOptionText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
});