import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import Button from '../../components/common/Button';

export default function TransferScreen({ navigation }: any) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');
  const [loading, setLoading] = useState(false);

  const handleValidateRecipient = async () => {
    if (!recipient || recipient.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      Alert.alert('Success', 'Recipient validated');
    } catch (error) {
      Alert.alert('Error', 'Recipient not found');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!recipient || !amount) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }
    navigation.navigate('TransferConfirm', { recipient, amount: parseFloat(amount), narration });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transfer</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Transfer Type */}
        <View style={styles.typeSelector}>
          <TouchableOpacity style={[styles.typeButton, styles.typeButtonActive]}>
            <Text style={[styles.typeButtonText, styles.typeButtonTextActive]}>To Nerra</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.typeButton}>
            <Text style={styles.typeButtonText}>To Bank</Text>
          </TouchableOpacity>
        </View>

        {/* Recipient */}
        <View style={styles.section}>
          <Text style={styles.label}>Recipient Phone Number</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={recipient}
              onChangeText={setRecipient}
              placeholder="+234 800 000 0000"
              keyboardType="phone-pad"
            />
            <TouchableOpacity style={styles.validateButton} onPress={handleValidateRecipient}>
              <Text style={styles.validateText}>Validate</Text>
            </TouchableOpacity>
          </View>
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
              placeholder="0.00"
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.availableText}>Available: ₦125,000</Text>
        </View>

        {/* Narration */}
        <View style={styles.section}>
          <Text style={styles.label}>Narration (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={narration}
            onChangeText={setNarration}
            placeholder="What's this for?"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Quick Amounts */}
        <View style={styles.section}>
          <Text style={styles.label}>Quick Amounts</Text>
          <View style={styles.quickAmounts}>
            {[5000, 10000, 20000, 50000].map((val) => (
              <TouchableOpacity
                key={val}
                style={styles.quickAmount}
                onPress={() => setAmount(val.toString())}
              >
                <Text style={styles.quickAmountText}>₦{val.toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Fee */}
        <View style={styles.feeContainer}>
          <Text style={styles.feeLabel}>Transfer Fee</Text>
          <Text style={styles.feeValue}>₦10.00</Text>
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            size="large"
            disabled={!recipient || !amount}
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
  typeSelector: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xs,
  },
  typeButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  typeButtonActive: {
    backgroundColor: Colors.primary,
  },
  typeButtonText: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
  },
  typeButtonTextActive: {
    color: Colors.text.white,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
  },
  validateButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
  },
  validateText: {
    color: Colors.text.white,
    fontWeight: '600',
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
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.text.primary,
    marginRight: Spacing.xs,
  },
  amountInput: {
    flex: 1,
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.text.primary,
    paddingVertical: Spacing.md,
  },
  availableText: {
    fontSize: FontSizes.sm,
    color: Colors.success,
    marginTop: Spacing.xs,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  quickAmount: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickAmountText: {
    color: Colors.text.primary,
    fontWeight: '500',
  },
  feeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginTop: Spacing.lg,
  },
  feeLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  feeValue: {
    fontSize: FontSizes.sm,
    color: Colors.text.primary,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
});