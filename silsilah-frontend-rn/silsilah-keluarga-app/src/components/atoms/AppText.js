import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function AppText({ variant = 'body', style, children, ...props }) {
  // Amankan skema gaya. Jika variant tidak ditemukan di stylesheet, dialihkan ke default 'body'
  const selectedStyle = styles[variant] ? styles[variant] : styles.body;

  return (
    <Text style={[selectedStyle, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  body: {
    fontSize: 14,
    color: '#1f1f1f',
    fontWeight: '400',
  },
  bodyStrong: {
    fontSize: 14,
    color: '#1f1f1f',
    fontWeight: '700',
  },
  caption: {
    fontSize: 11,
    color: '#8a8a8e',
    fontWeight: '500',
  },
  // Kita tambahkan penampung darurat title & subtitle agar jika ada file tersembunyi lain 
  // yang memanggilnya, aplikasi Anda tetap aman dan berjalan mulus!
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#002c8c',
  },
  subtitle: {
    fontSize: 14,
    color: '#4b70cc',
    fontWeight: '500',
  }
});