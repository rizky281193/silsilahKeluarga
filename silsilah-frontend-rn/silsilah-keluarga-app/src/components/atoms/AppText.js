import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../theme/tokens';

const variantStyles = {
  title: typography.title,
  subtitle: typography.subtitle,
  body: typography.body,
  bodyStrong: typography.bodyStrong,
};

export default function AppText({ variant = 'body', style, children }) {
  return <Text style={[styles.base, variantStyles[variant], style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  base: {
    color: colors.textPrimary,
  },
});
