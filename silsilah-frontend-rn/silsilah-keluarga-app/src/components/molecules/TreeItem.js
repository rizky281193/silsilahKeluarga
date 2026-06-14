import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MemberCard from '../organisms/MemberCard';
import AppText from '../atoms/AppText';
import { spacing } from '../../theme/tokens';

export default function TreeItem({ node, level = 0 }) {
  // State untuk mengontrol apakah anak-anak dari node ini sedang ditampilkan atau disembunyikan
  const [isExpanded, setIsExpanded] = useState(true);
  
  const hasChildren = node.children && node.children.length > 0;
  const indentSize = level * spacing.md; // Menghitung jarak tab masuk ke dalam berdasarkan generasi

  return (
    <View style={styles.container}>
      
      {/* BARIS UTAMA: Indentasi + Tombol Kontrol + Kartu Anggota */}
      <View style={[styles.row, { paddingLeft: indentSize }]}>
        
        {/* Tombol Expand/Collapse jika memiliki anak */}
        {hasChildren ? (
          <TouchableOpacity 
            onPress={() => setIsExpanded(!isExpanded)} 
            style={styles.toggleButton}
            activeOpacity={0.7}
          >
            <AppText variant="bodyStrong" style={styles.toggleText}>
              {isExpanded ? '▼' : '▶'}
            </AppText>
          </TouchableOpacity>
        ) : (
          // Spacer kosong jika tidak punya anak agar posisi kartu tetap sejajar
          <View style={styles.spacer} />
        )}

        {/* Kartu Informasi Anggota Keluarga */}
        <View style={styles.cardContainer}>
          <MemberCard member={node} />
        </View>
        
      </View>

      {/* REKURSIF JALUR DALAM: Jika dibuka dan punya anak, render anak-anaknya di bawahnya */}
      {hasChildren && isExpanded && (
        <View style={styles.childrenList}>
          {/* Garis vertikal halus di sebelah kiri untuk menandakan satu payung keturunan */}
          <View style={[styles.guideLine, { left: indentSize + 22 }]} />
          
          {node.children.map((child) => (
            <TreeItem key={child.id} node={child} level={level + 1} />
          ))}
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  toggleButton: {
    width: 30,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  toggleText: {
    fontSize: 14,
    color: '#8e8e93',
  },
  spacer: {
    width: 30,
  },
  cardContainer: {
    flex: 1,
  },
  childrenList: {
    position: 'relative',
    width: '100%',
  },
  // Garis pemandu silsilah vertikal ala Github/Filesystem tree
  guideLine: {
    position: 'absolute',
    top: 0,
    bottom: 20,
    width: 1,
    backgroundColor: '#e5e5ea',
  },
});