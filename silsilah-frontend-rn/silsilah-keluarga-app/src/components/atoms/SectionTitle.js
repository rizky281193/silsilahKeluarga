import React from 'react';
import { StyleSheet } from 'react-native';
import AppText from './AppText';

export default function SectionTitle({ children }) {
  return (
    <AppText variant="title" style={styles.title}>
      {children}
    </AppText>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
});
