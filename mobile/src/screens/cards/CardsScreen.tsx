import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import Button from '../../components/common/Button';

interface VirtualCard {
  id: string;
  last4: string;
  expiry: string;
  balance: number;
  status: 'active' | 'frozen';
}

export default function CardsScreen({ navigation }: any) {
  const [cards, setCards] = useState<VirtualCard[]>([
    { id: '1', last4: '4532', expiry: '12/26', balance: 25000, status: 'active' },
  ]);
  const [loading, setLoading] = useState(false);

  const handleFreezeCard = (cardId: string) => {
    Alert.alert('Freeze Card', 'Are you sure you want to freeze this card?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Freeze', 
        onPress: () => {
          setCards(cards.map(c => c.id === cardId ? { ...c, status: 'frozen' as const } : c));
        }
      },
    ]);
  };

  const handleUnfreezeCard = (cardId: string) => {
    setCards(cards.map(c => c.id === cardId ? { ...c, status: 'active' as const } : c));
  };

  const handleCreateCard = async () => {
    if (cards.length >= 3) {
      Alert.alert('Limit Reached', 'You can only have 3 virtual cards');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newCard: VirtualCard = {
        id: Date.now().toString(),
        last4: Math.floor(1000 + Math.random() * 9000).toString(),
        expiry: '12/27',
        balance: 0,
        status: 'active',
      };
      setCards([...cards, newCard]);
      Alert.alert('Success', 'Virtual card created!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Virtual Cards</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cards List */}
        <View style={styles.cardsContainer}>
          {cards.map((card) => (
            <View key={card.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardType}>Nerra Virtual</Text>
                <View style={[styles.statusBadge, card.status === 'frozen' && styles.statusBadgeFrozen]}>
                  <Text style={styles.statusText}>{card.status === 'frozen' ? 'Frozen' : 'Active'}</Text>
                </View>
              </View>
              <View style={styles.cardNumber}>
                <Text style={styles.cardNumberText}>•••• •••• •••• {card.last4}</Text>
              </View>
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.cardLabel}>Balance</Text>
                  <Text style={styles.cardValue}>₦{card.balance.toLocaleString()}</Text>
                </View>
                <View>
                  <Text style={styles.cardLabel}>Expires</Text>
                  <Text style={styles.cardValue}>{card.expiry}</Text>
                </View>
              </View>
              <View style={styles.cardActions}>
                {card.status === 'frozen' ? (
                  <TouchableOpacity style={styles.cardAction} onPress={() => handleUnfreezeCard(card.id)}>
                    <Ionicons name="play-circle" size={20} color={Colors.success} />
                    <Text style={styles.cardActionText}>Unfreeze</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.cardAction} onPress={() => handleFreezeCard(card.id)}>
                    <Ionicons name="pause-circle" size={20} color={Colors.warning} />
                    <Text style={styles.cardActionText}>Freeze</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.cardAction}>
                  <Ionicons name="wallet" size={20} color={Colors.primary} />
                  <Text style={styles.cardActionText}>Fund</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Create Card */}
        <View style={styles.createSection}>
          <Button
            title="Create New Card"
            onPress={handleCreateCard}
            loading={loading}
            variant="outline"
            size="large"
            disabled={cards.length >= 3}
          />
          <Text style={styles.limitText}>Maximum 3 cards • Free to create</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Card Features</Text>
          <View style={styles.featureItem}>
            <Ionicons name="globe" size={20} color={Colors.primary} />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Global Accept</Text>
              <Text style={styles.featureDesc}>Use anywhere Visa is accepted</Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Secure</Text>
              <Text style={styles.featureDesc}>Freeze anytime, set spending limits</Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="card" size={20} color={Colors.primary} />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Instant Funding</Text>
              <Text style={styles.featureDesc}>Fund instantly from your wallet</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.md },
  title: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.text.primary },
  cardsContainer: { paddingHorizontal: Spacing.lg, gap: Spacing.md },
  card: { backgroundColor: Colors.primary, borderRadius: BorderRadius.xl, padding: Spacing.lg },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.lg },
  cardType: { fontSize: FontSizes.lg, fontWeight: '600', color: Colors.text.white },
  statusBadge: { backgroundColor: Colors.success, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: BorderRadius.sm },
  statusBadgeFrozen: { backgroundColor: Colors.warning },
  statusText: { fontSize: FontSizes.xs, color: Colors.text.white, fontWeight: '600' },
  cardNumber: { marginBottom: Spacing.lg },
  cardNumberText: { fontSize: FontSizes.lg, color: Colors.text.white, letterSpacing: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.lg },
  cardLabel: { fontSize: FontSizes.xs, color: Colors.text.white + '80' },
  cardValue: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.text.white },
  cardActions: { flexDirection: 'row', gap: Spacing.lg },
  cardAction: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  cardActionText: { fontSize: FontSizes.sm, color: Colors.text.white },
  createSection: { padding: Spacing.lg, alignItems: 'center' },
  limitText: { fontSize: FontSizes.sm, color: Colors.text.light, marginTop: Spacing.sm },
  featuresSection: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
  featuresTitle: { fontSize: FontSizes.lg, fontWeight: '600', color: Colors.text.primary, marginBottom: Spacing.md },
  featureItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md },
  featureContent: { marginLeft: Spacing.md },
  featureTitle: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.text.primary },
  featureDesc: { fontSize: FontSizes.sm, color: Colors.text.secondary },
});