import React, { useState } from 'react';
import { FlatList, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import TreeItem from '../molecules/TreeItem';
import { spacing, radius, colors } from '../../theme/tokens';
import { Users, ChevronDown, ChevronUp } from 'lucide-react-native';
import AppText from '../atoms/AppText';

export default function FamilyTreeTemplate({ treeData }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandTrigger, setExpandTrigger] = useState(null);

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

  // Fungsi untuk mengganti trigger
  const handleToggleAll = (status) => {
    setExpandTrigger(status);
    // Reset trigger setelah dikirim agar tidak mengunci state internal
    setTimeout(() => setExpandTrigger(null), 100);
  };

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

        {/* TOMBOL TOGGLE GLOBAL */}
        <View style={styles.toggleRow}>
          <TouchableOpacity style={styles.miniBtn} onPress={() => handleToggleAll(true)}>
            <ChevronDown size={14} color={colors.primary} />
            <AppText style={styles.miniBtnText}>Buka Semua</AppText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.miniBtn} onPress={() => handleToggleAll(false)}>
            <ChevronUp size={14} color={colors.textLight} />
            <AppText style={styles.miniBtnText}>Tutup Semua</AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* DAFTAR POHON SILSILAH */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TreeItem 
            node={item} 
            level={0} 
            searchQuery={searchQuery} 
            expandTrigger={expandTrigger} 
          />
        )}
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
    backgroundColor: colors.background, // Selaraskan background halaman silsilah dengan warna biru es beranda!
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
  toggleRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  miniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginRight: 10,
  },
  miniBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#48484a',
    marginLeft: 4,
  },
});