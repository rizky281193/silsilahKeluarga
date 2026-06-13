import React from 'react';
import { View, StyleSheet } from 'react-native';
import SectionTitle from '../atoms/SectionTitle';
import InlineError from '../molecules/InlineError';
import { colors, spacing } from '../../theme/tokens';

export default function DefaultPageTemplate({ title, errorMessage, children }) {
  return (
    <View style={styles.container}>
      <SectionTitle>{title}</SectionTitle>
      <InlineError message={errorMessage} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
    paddingHorizontal: spacing.lg,
  },
});
