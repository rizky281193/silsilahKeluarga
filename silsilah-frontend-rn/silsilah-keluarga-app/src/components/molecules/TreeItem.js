import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MemberCard from '../organisms/MemberCard';
import AppText from '../atoms/AppText';
import { colors, spacing } from '../../theme/tokens';

export default function TreeItem({ node, level = 0, searchQuery = '' }) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const hasChildren = node.children && node.children.length > 0;
  const indentSize = level * spacing.md;

  // FUNGSI CERDAS: Jika ada query pencarian, cek apakah ada anak/cucu di bawahnya yang cocok
  const hasMatchingChild = (item, query) => {
    if (!query) return false;
    if (!item.children) return false;
    return item.children.some(child => 
      child.name.toLowerCase().includes(query.toLowerCase()) || 
      hasMatchingChild(child, query)
    );
  };

  // Efek otomatis membuka tab jika keturunan di bawahnya cocok dengan teks pencarian
  useEffect(() => {
    if (searchQuery && hasMatchingChild(node, searchQuery)) {
      setIsExpanded(true);
    }
  }, [searchQuery, node]);

  // Cek apakah kartu ini sendiri cocok dengan pencarian (untuk efek highlight visual jika mau)
  const isMatched = searchQuery && node.name.toLowerCase().includes(searchQuery.toLowerCase());

  return (
    <View style={[styles.container, isMatched && styles.matchedHighlight]}>
      
      {/* BARIS UTAMA */}
      <View style={[styles.row, { paddingLeft: indentSize }]}>
        
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
          <View style={styles.spacer} />
        )}

        <View style={styles.cardContainer}>
          <MemberCard member={node} />
        </View>
        
      </View>

      {/* REKURSIF ANAK */}
      {hasChildren && isExpanded && (
        <View style={styles.childrenList}>
          <View style={[styles.guideLine, { left: indentSize + 22 }]} />
          
          {node.children.map((child) => (
            <TreeItem 
              key={child.id} 
              node={child} 
              level={level + 1} 
              searchQuery={searchQuery} // Teruskan kata kunci ke level bawah
            />
          ))}
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 8,
  },
  matchedHighlight: {
    backgroundColor: colors.highlight, // Menggunakan warna sorotan dari token global
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
    color: colors.textLight,
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
  guideLine: {
    position: 'absolute',
    top: 0,
    bottom: 20,
    width: 1,
    backgroundColor: colors.divider,
  },
});