import React, { useState } from 'react';
import { FlatList, StyleSheet, View, TextInput } from 'react-native';
import TreeItem from '../molecules/TreeItem';
import { spacing, radius, colors } from '../../theme/tokens';

export default function FamilyTreeTemplate({ treeData }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filterTree = (nodes, query) => {
    if (!query) return nodes;

    const checkMatch = (node, searchStr) => {
      const nameMatch = node.name.toLowerCase().includes(searchStr.toLowerCase());
      const bioMatch = node.biografi && node.biografi.toLowerCase().includes(searchStr.toLowerCase());
      
      // 1. Cek apakah ada pasangan (istri/suami) yang namanya cocok dengan kata kunci
      const spouseMatch = node.spouses && node.spouses.some(s => 
        s.name.toLowerCase().includes(searchStr.toLowerCase())
      );

      if (nameMatch || bioMatch || spouseMatch) {
        return true;
      }

      // 2. Cek anak-anaknya (Garis darah ayah/ibu)
      if (node.children && node.children.length > 0) {
        return node.children.some(child => checkMatch(child, searchStr));
      }

      return false;
    };

    return nodes
      .filter(node => checkMatch(node, query))
      .map(node => ({
        ...node,
        children: filterTree(node.children || [], query)
      }));
  };

  // Jalankan penyaringan data silsilah secara realtime
  const filteredData = filterTree(treeData, searchQuery);

  return (
    <View style={styles.container}>
      
      {/* KOTAK PENCARIAN (SEARCH BAR) */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Cari nama anggota keluarga / biografi..."
          placeholderTextColor="#8e8e93"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing" // Fitur iOS otomatis untuk tombol 'X' pembersih teks
        />
      </View>

      {/* DAFTAR POHON SILSILAH */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TreeItem node={item} level={0} searchQuery={searchQuery} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  searchContainer: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: 'transparent',
    marginBottom: spacing.xs,
  },
  searchInput: {
    height: 44,
    backgroundColor: '#e9e9eb',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    color: '#000',
  },
  listContent: {
    paddingVertical: spacing.xs,
    paddingBottom: spacing.xl * 3,
  },
});