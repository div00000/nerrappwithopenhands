import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import Button from '../../components/common/Button';

const categories = [
  { id: 'electricity', name: 'Electricity', icon: 'flash' },
  { id: 'tv', name: 'TV & Entertainment', icon: 'tv' },
  { id: 'internet', name: 'Internet', icon: 'wifi' },
  { id: 'education', name: 'Education', icon: 'school' },
];

const billers: Record<string, { id: string; name: string }[]> = {
  electricity: [
    { id: 'ikeja', name: 'Ikeja Electric' },
    { id: 'eko', name: 'Eko Electric' },
    { id: 'jos', name: 'Jos Electric' },
  ],
  tv: [
    { id: 'dstv', name: 'DSTV' },
    { id: 'gotv', name: 'GOTV' },
    { id: 'startimes', name: 'StarTimes' },
  ],
  internet: [
    { id: 'spectranet', name: 'Spectranet' },
    { id: 'smile', name: 'Smile' },
  ],
  education: [
    { id: 'waec', name: 'WAEC' },
    { id: 'jamb', name: 'JAMB' },
  ],
};

export default function BillsScreen({ navigation }: any) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBiller, setSelectedBiller] = useState<string | null>(null);
  const [meterNumber, setMeterNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!selectedCategory || !selectedBiller || !amount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('Success', 'Bill payment successful!');
    } catch (error) {
      Alert.alert('Error', 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pay Bills</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.label}>Select Category</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.id && styles.categoryCardSelected,
                ]}
                onPress={() => {
                  setSelectedCategory(category.id);
                  setSelectedBiller(null);
                }}
              >
                <Ionicons 
                  name={category.icon as any} 
                  size={24} 
                  color={selectedCategory === category.id ? Colors.primary : Colors.text.secondary} 
                />
                <Text style={[
                  styles.categoryName,
                  selectedCategory === category.id && styles.categoryNameSelected,
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Billers */}
        {selectedCategory && (
          <View style={styles.section}>
            <Text style={styles.label}>Select Biller</Text>
            <View style={styles.billersList}>
              {billers[selectedCategory]?.map((biller) => (
                <TouchableOpacity
                  key={biller.id}
                  style={[
                    styles.billerCard,
                    selectedBiller === biller.id && styles.billerCardSelected,
                  ]}
                  onPress={() => setSelectedBiller(biller.id)}
                >
                  <Text style={[
                    styles.billerName,
                    selectedBiller === biller.id && styles.billerNameSelected,
                  ]}>{biller.name}</Text>
                  <Ionicons 
                    name={selectedBiller === biller.id ? 'radio-button-on' : 'radio-button-off'} 
                    size={20} 
                    color={selectedBiller === biller.id ? Colors.primary : Colors.text.light} 
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Meter/Account Number */}
        {selectedCategory === 'electricity' && (
          <View style={styles.section}>
            <Text style={styles.label}>Meter Number</Text>
            <TextInput
              style={styles.input}
              value={meterNumber}
              onChangeText={setMeterNumber}
              placeholder="Enter meter number"
              keyboardType="default"
            />
          </View>
        )}

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
          <View style={styles.quickAmounts}>
            {[1000, 2000, 5000, 10000].map((val) => (
              <TouchableOpacity
                key={val}
                style={[styles.quickAmount, amount === val.toString() && styles.quickAmountSelected]}
                onPress={() => setAmount(val.toString())}
              >
                <Text style={[styles.quickAmountText, amount === val.toString() && styles.quickAmountTextSelected]}>
                  ₦{val.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Pay Bill"
            onPress={handlePay}
            loading={loading}
            size="large"
            disabled={!selectedCategory || !selectedBiller || !amount}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.md },
  title: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.text.primary },
  section: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  label: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.text.primary, marginBottom: Spacing.sm },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  categoryCard: { width: '47%', padding: Spacing.md, backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, alignItems: 'center', borderWidth: 2, borderColor: Colors.border },
  categoryCardSelected: { borderColor: Colors.primary },
  categoryName: { fontSize: FontSizes.sm, color: Colors.text.secondary, marginTop: Spacing.xs },
  categoryNameSelected: { color: Colors.primary, fontWeight: '600' },
  billersList: { gap: Spacing.sm },
  billerCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md, backgroundColor: Colors.surface, borderRadius: BorderRadius.lg },
  billerCardSelected: { backgroundColor: Colors.primary + '10' },
  billerName: { fontSize: FontSizes.md, color: Colors.text.primary },
  billerNameSelected: { color: Colors.primary, fontWeight: '600' },
  input: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, fontSize: FontSizes.md },
  amountInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md },
  currency: { fontSize: FontSizes.xl, fontWeight: '600', color: Colors.text.primary, marginRight: Spacing.xs },
  amountInput: { flex: 1, fontSize: FontSizes.xl, fontWeight: '600', color: Colors.text.primary, paddingVertical: Spacing.md },
  quickAmounts: { flexDirection: 'row', gap: Spacing.sm },
  quickAmount: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.border },
  quickAmountSelected: { backgroundColor: Colors.primary },
  quickAmountText: { fontSize: FontSizes.sm, fontWeight: '500', color: Colors.text.primary },
  quickAmountTextSelected: { color: Colors.text.white },
  buttonContainer: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl, paddingTop: Spacing.lg },
});