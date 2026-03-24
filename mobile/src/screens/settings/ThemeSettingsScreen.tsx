import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, ThemeName, themes } from '../contexts/ThemeContext';

const themeOptions: { name: ThemeName; label: string; emoji: string; description: string }[] = [
  { name: 'cyberTech', label: 'Cyber Tech', emoji: '🤖', description: 'Deep purple & violet' },
  { name: 'neonNoir', label: 'Neon Noir', emoji: '🌃', description: 'Purple & blue glow' },
  { name: 'emberGlow', label: 'Ember Glow', emoji: '🔥', description: 'Warm orange fire' },
  { name: 'warmSunset', label: 'Warm Sunset', emoji: '🌅', description: 'Orange sunset vibes' },
  { name: 'cosmicPurple', label: 'Cosmic Purple', emoji: '🌌', description: 'Deep cosmic purple' },
  { name: 'toxicForest', label: 'Toxic Forest', emoji: '🌲', description: 'Green nature glow' },
];

export default function ThemeSettingsScreen({ navigation }: any) {
  const { themeName, setTheme, theme } = useTheme();

  const handleThemeSelect = (themeName: ThemeName) => {
    setTheme(themeName);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Theme</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            Choose your preferred theme
          </Text>
          
          <View style={styles.themeGrid}>
            {themeOptions.map((option) => {
              const isSelected = themeName === option.name;
              const themeColors = themes[option.name];
              
              return (
                <TouchableOpacity
                  key={option.name}
                  style={[
                    styles.themeCard,
                    { 
                      backgroundColor: themeColors.surface,
                      borderColor: isSelected ? themeColors.accent : themeColors.border,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                  onPress={() => handleThemeSelect(option.name)}
                >
                  {/* Color Preview Strip */}
                  <View style={styles.colorPreview}>
                    <View style={[styles.colorDot, { backgroundColor: themeColors.bgPrimary }]} />
                    <View style={[styles.colorDot, { backgroundColor: themeColors.surface }]} />
                    <View style={[styles.colorDot, { backgroundColor: themeColors.accent }]} />
                    <View style={[styles.colorDot, { backgroundColor: themeColors.accentSecondary }]} />
                  </View>
                  
                  <View style={styles.themeInfo}>
                    <View style={styles.themeLabelRow}>
                      <Text style={styles.emoji}>{option.emoji}</Text>
                      <Text style={[styles.themeLabel, { color: theme.text }]}>
                        {option.label}
                      </Text>
                    </View>
                    <Text style={[styles.themeDesc, { color: theme.textMuted }]}>
                      {option.description}
                    </Text>
                  </View>
                  
                  {isSelected && (
                    <View style={[styles.checkmark, { backgroundColor: themeColors.accent }]}>
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Preview Section */}
        <View style={styles.previewSection}>
          <Text style={[styles.previewTitle, { color: theme.textSecondary }]}>
            Live Preview
          </Text>
          
          {/* Mini App Preview */}
          <View style={[styles.previewCard, { backgroundColor: theme.surface }]}>
            {/* Header */}
            <View style={[styles.previewHeader, { backgroundColor: theme.primary }]}>
              <Text style={styles.previewLogo}>Nerra</Text>
              <Text style={styles.previewGreeting}>Hello, User 👋</Text>
            </View>
            
            {/* Balance Card */}
            <View style={[styles.previewBalanceCard, { backgroundColor: theme.primary }]}>
              <Text style={styles.previewBalanceLabel}>Available Balance</Text>
              <Text style={styles.previewBalanceAmount}>₦125,000</Text>
            </View>
            
            {/* Quick Actions */}
            <View style={styles.previewActions}>
              {['➕', '⇄', '📞', '📄'].map((emoji, i) => (
                <View key={i} style={[styles.previewAction, { backgroundColor: theme.primary + '20' }]}>
                  <Text style={styles.previewActionEmoji}>{emoji}</Text>
                </View>
              ))}
            </View>
            
            {/* Transaction */}
            <View style={styles.previewTx}>
              <View style={[styles.previewTxIcon, { backgroundColor: theme.success + '20' }]}>
                <Text style={{ color: theme.success }}>↓</Text>
              </View>
              <View style={styles.previewTxDetails}>
                <Text style={[styles.previewTxDesc, { color: theme.text }]}>From John Doe</Text>
                <Text style={[styles.previewTxDate, { color: theme.textMuted }]}>Today</Text>
              </View>
              <Text style={[styles.previewTxAmount, { color: theme.success }]}>+₦5,000</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  themeGrid: {
    gap: 12,
  },
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  colorPreview: {
    flexDirection: 'row',
    marginRight: 14,
  },
  colorDot: {
    width: 20,
    height: 32,
    borderRadius: 4,
  },
  themeInfo: {
    flex: 1,
  },
  themeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  emoji: {
    fontSize: 16,
    marginRight: 8,
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  themeDesc: {
    fontSize: 12,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewSection: {
    padding: 20,
    marginTop: 20,
  },
  previewTitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  previewCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  previewHeader: {
    padding: 20,
    paddingBottom: 30,
  },
  previewLogo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  previewGreeting: {
    fontSize: 16,
    color: '#fff',
    marginTop: 8,
  },
  previewBalanceCard: {
    margin: 16,
    marginTop: -20,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  previewBalanceLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  previewBalanceAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginTop: 4,
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  previewAction: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewActionEmoji: {
    fontSize: 20,
  },
  previewTx: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  previewTxIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  previewTxDetails: {
    flex: 1,
  },
  previewTxDesc: {
    fontSize: 14,
    fontWeight: '500',
  },
  previewTxDate: {
    fontSize: 11,
    marginTop: 2,
  },
  previewTxAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
});