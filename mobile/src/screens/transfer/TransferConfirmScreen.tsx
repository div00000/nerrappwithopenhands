import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import Button from '../../components/common/Button';

export default function TransferConfirmScreen({ navigation, route }: any) {
  const { recipient, amount, narration } = route.params;
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    if (!pin || pin.length < 4) {
      Alert.alert('Error', 'Please enter your PIN');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert('Success', 'Transfer completed successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePinPress = (digit: string) => {
    if (pin.length < 6) {
      setPin(pin + digit);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Confirm Transfer</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Transfer Details */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Recipient</Text>
            <Text style={styles.detailValue}>{recipient}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.amountValue}>₦{amount.toLocaleString()}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fee</Text>
            <Text style={styles.detailValue}>₦10.00</Text>
          </View>
          <View style={[styles.detailRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₦{(amount + 10).toLocaleString()}</Text>
          </View>
          {narration && (
            <View style={styles.narrationRow}>
              <Text style={styles.detailLabel}>Narration</Text>
              <Text style={styles.detailValue}>{narration}</Text>
            </View>
          )}
        </View>

        {/* PIN Input */}
        <View style={styles.pinSection}>
          <Text style={styles.pinLabel}>Enter your transaction PIN</Text>
          <View style={styles.pinDots}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <View
                key={i}
                style={[styles.pinDot, pin.length > i && styles.pinDotFilled]}
              />
            ))}
          </View>
        </View>

        {/* Numeric Keypad */}
        <View style={styles.keypad}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((key, index) => (
            key === '' ? (
              <View key={index} style={styles.keyEmpty} />
            ) : key === 'del' ? (
              <TouchableOpacity key={index} style={styles.key} onPress={handleDelete}>
                <Ionicons name="backspace-outline" size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity key={index} style={styles.key} onPress={() => handlePinPress(key)}>
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            )
          ))}
        </View>

        <Button
          title="Confirm Transfer"
          onPress={handleTransfer}
          loading={loading}
          size="large"
          style={styles.button}
          disabled={pin.length < 4}
        />
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  detailsCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  detailLabel: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
  },
  detailValue: {
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  amountValue: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
  },
  totalLabel: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  totalValue: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.primary,
  },
  narrationRow: {
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    marginTop: Spacing.sm,
  },
  pinSection: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  pinLabel: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },
  pinDots: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.border,
  },
  pinDotFilled: {
    backgroundColor: Colors.primary,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  key: {
    width: 72,
    height: 56,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyEmpty: {
    width: 72,
    height: 56,
  },
  keyText: {
    fontSize: FontSizes.xl,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  button: {
    marginTop: Spacing.lg,
  },
});