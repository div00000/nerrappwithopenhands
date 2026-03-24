import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import Button from '../../components/common/Button';

const networks = [
  { id: 'mtn', name: 'MTN', color: '#FFCC00' },
  { id: 'airtel', name: 'Airtel', color: '#E60000' },
  { id: 'glo', name: 'Glo', color: '#00A651' },
  { id: '9mobile', name: '9Mobile', color: '#39B549' },
];

const denominations = [100, 200, 500, 1000, 2000, 5000];

export default function AirtimeScreen({ navigation }: any) {
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (!selectedNetwork || !phone || !amount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('Success', 'Airtime purchased successfully!');
    } catch (error) {
      Alert.alert('Error', 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Buy Airtime</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Network Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Select Network</Text>
          <View style={styles.networksGrid}>
            {networks.map((network) => (
              <TouchableOpacity
                key={network.id}
                style={[
                  styles.networkCard,
                  selectedNetwork === network.id && styles.networkCardSelected,
                ]}
                onPress={() => setSelectedNetwork(network.id)}
              >
                <View style={[styles.networkIcon, { backgroundColor: network.color }]}>
                  <Text style={styles.networkInitial}>{network.name[0]}</Text>
                </View>
                <Text style={[
                  styles.networkName,
                  selectedNetwork === network.id && styles.networkNameSelected,
                ]}>
                  {network.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Phone Number */}
        <View style={styles.section}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="+234 800 000 0000"
            keyboardType="phone-pad"
          />
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <Text style={styles.label}>Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currency}>₦</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Quick Amounts */}
        <View style={styles.section}>
          <Text style={styles.label}>Quick Amounts</Text>
          <View style={styles.denominationsGrid}>
            {denominations.map((denom) => (
              <TouchableOpacity
                key={denom}
                style={[
                  styles.denomCard,
                  amount === denom.toString() && styles.denomCardSelected,
                ]}
                onPress={() => setAmount(denom.toString())}
              >
                <Text style={[
                  styles.denomText,
                  amount === denom.toString() && styles.denomTextSelected,
                ]}>₦{denom.toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Available Balance */}
        <View style={styles.balanceInfo}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceValue}>₦125,000</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Purchase Airtime"
            onPress={handlePurchase}
            loading={loading}
            size="large"
            disabled={!selectedNetwork || !phone || !amount}
          />
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
  section: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  networksGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  networkCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  networkCardSelected: {
    borderColor: Colors.primary,
  },
  networkIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  networkInitial: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text.white,
  },
  networkName: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
  },
  networkNameSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
  },
  currency: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.text.primary,
    marginRight: Spacing.xs,
  },
  amountInput: {
    flex: 1,
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.text.primary,
    paddingVertical: Spacing.md,
  },
  denominationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  denomCard: {
    width: '30%',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  denomCardSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  denomText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  denomTextSelected: {
    color: Colors.text.white,
  },
  balanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginTop: Spacing.lg,
  },
  balanceLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  balanceValue: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.success,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
});