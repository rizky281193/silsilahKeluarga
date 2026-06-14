import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AppText from './AppText';
import { colors } from '../../theme/tokens';

export default function LoadingState({ label }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.accent} />
      <AppText style={styles.label}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    marginTop: 12,
  },
});
