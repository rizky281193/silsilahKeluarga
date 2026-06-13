import React from 'react';
import { StyleSheet } from 'react-native';
import AppText from '../atoms/AppText';
import { colors, spacing } from '../../theme/tokens';

export default function InlineError({ message }) {
  if (!message) {
    return null;
  }

  return (
    <AppText variant="body" style={styles.errorText}>
      {message}
    </AppText>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: colors.danger,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
});
