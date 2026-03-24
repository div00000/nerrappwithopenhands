import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import Button from '../common/Button';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Welcome to Nerra',
    description: 'Your all-in-one financial companion. Send money, pay bills, and manage your finances with ease.',
    icon: '💰',
  },
  {
    id: '2',
    title: 'Flexible Access',
    description: 'Sign in with Google, Apple, or email. Your choice, your security.',
    icon: '🔐',
  },
  {
    id: '3',
    title: 'Everything in One Place',
    description: 'Wallet, transfers, airtime, data, bills, and virtual cards. All in one app.',
    icon: '💳',
  },
  {
    id: '4',
    title: 'Security First',
    description: 'Phone verification, transaction PIN, KYC, and fraud controls keep your money safe.',
    icon: '🛡️',
  },
  {
    id: '5',
    title: 'Licensed Partners',
    description: 'Financial services delivered through licensed third-party partners. Nerra is not a bank.',
    icon: '📋',
  },
];

interface OnboardingScreenProps {
  onComplete?: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const renderSlide = ({ item }: { item: typeof slides[0] }) => (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onComplete?.();
    }
  };

  const handleSkip = () => {
    onComplete?.();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        {currentIndex === slides.length - 1 ? (
          <Button
            title="Get Started"
            onPress={handleNext}
            variant="primary"
            size="large"
          />
        ) : (
          <View style={styles.buttonRow}>
            <Button
              title="Next"
              onPress={handleNext}
              variant="primary"
              size="large"
              style={styles.nextButton}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  skipContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  skipText: {
    color: Colors.text.secondary,
    fontSize: FontSizes.md,
  },
  slide: {
    width,
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl * 2,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  icon: {
    fontSize: 60,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  nextButton: {
    flex: 1,
  },
});