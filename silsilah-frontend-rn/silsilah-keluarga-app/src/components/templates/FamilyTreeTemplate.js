import React, { useState } from 'react';
import { FlatList, StyleSheet, View, TextInput, TouchableOpacity, Modal } from 'react-native';
import TreeItem from '../molecules/TreeItem';
import AppText from '../atoms/AppText';
import { spacing, radius, colors } from '../../theme/tokens';
import { ChevronDown, ChevronUp, SlidersHorizontal, X, Check } from 'lucide-react-native';

export default function FamilyTreeTemplate({ treeData }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandTrigger, setExpandTrigger] = useState(null);
  const [selectedGen, setSelectedGen] = useState(null);
  // STATE BARU: Untuk mengontrol buka/tutup lembaran BottomSheet Filter
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Algoritma filter data silsilah (Tetap kokoh seperti versi sebelumnya)
  const filterTree = (nodes, query, genTarget, currentLevel = 0) => {
    if (!nodes) return [];

    if (genTarget !== null) {
      return nodes
        .map(node => {
          const isTargetGen = currentLevel === genTarget;
          return {
            ...node,
            children: isTargetGen ? [] : filterTree(node.children || [], query, genTarget, currentLevel + 1)
          };
        })
        .filter(node => {
          const isTargetGen = currentLevel === genTarget;
          const hasMatchingDescendant = node.children && node.children.length > 0;

          if (isTargetGen) {
            const nameMatch = node.name.toLowerCase().includes(query.toLowerCase());
            return query ? nameMatch : true;
          }
          return hasMatchingDescendant;
        });
    }

    const checkMatch = (node, searchStr) => {
      const nameMatch = node.name.toLowerCase().includes(searchStr.toLowerCase());
      const bioMatch = node.biografi && node.biografi.toLowerCase().includes(searchStr.toLowerCase());
      const spouseMatch = node.spouses && node.spouses.some(s => 
        s.name.toLowerCase().includes(searchStr.toLowerCase())
      );

      if (nameMatch || bioMatch || spouseMatch) return true;
      if (node.children && node.children.length > 0) {
        return node.children.some(child => checkMatch(child, searchStr));
      }
      return false;
    };

    return nodes
      .filter(node => (!query ? true : checkMatch(node, query)))
      .map(node => ({
        ...node,
        children: filterTree(node.children || [], query, null, currentLevel + 1)
      }));
  };

  const filteredData = filterTree(treeData, searchQuery, selectedGen);

  const handleToggleAll = (status) => {
    setExpandTrigger(status);
    setTimeout(() => setExpandTrigger(null), 100);
  };

  const genOptions = [
    { label: '✨ Tampilkan Semua Generasi', value: null },
    { label: 'Generasi 1 (Anak)', value: 1 },
    { label: 'Generasi 2 (Cucu)', value: 2 },
    { label: 'Generasi 3 (Cicit)', value: 3 },
  ];

  // Mencari label aktif untuk dipajang di badge utama
  const activeGenLabel = selectedGen === null ? 'Semua Gen' : `Gen ${selectedGen}`;

  return (
    <View style={styles.container}>      
      
      {/* HEADER AREA KONTROL ATAS (SEKARANG ULTRA RINGKAS & BERSIH) */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Cari nama anggota keluarga..."
          placeholderTextColor="#8e8e93"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />

        {/* BARIS UTAMA BADGE FILTER & KONTROL TOGGLE */}
        <View style={styles.actionRow}>
          {/* BADGE FILTER DI TENGAH-KIRI (KLIK UNTUK BOTTOM SHEET) */}
          <TouchableOpacity 
            activeOpacity={0.8}
            style={[styles.filterBadge, selectedGen !== null && styles.filterBadgeActive]}
            onPress={() => {
              if (selectedGen !== null) {
                setSelectedGen(null);
                setExpandTrigger(false);
              } else {
                setIsFilterOpen(true);
              }
            }}
          >
            <SlidersHorizontal size={13} color={selectedGen !== null ? colors.surface : colors.primary} />
            <AppText style={[styles.filterBadgeText, selectedGen !== null && styles.filterBadgeTextActive]}>
              Filter: {activeGenLabel}
            </AppText>

            {selectedGen !== null && (
              <View style={styles.resetIconWrapper}>
                <X size={12} color={colors.surface} strokeWidth={3} />
              </View>
            )}
          </TouchableOpacity>

          {/* TOGGLE EXPAND/COLLAPSE (Otomatis tersembunyi jika sedang filter generasi) */}
          {selectedGen === null && (
            <View style={styles.toggleRow}>
              <TouchableOpacity style={styles.miniBtn} onPress={() => handleToggleAll(true)}>
                <ChevronDown size={13} color={colors.primary} />
                <AppText style={styles.miniBtnText}>Buka</AppText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.miniBtn} onPress={() => handleToggleAll(false)}>
                <ChevronUp size={13} color={colors.textLight} />
                <AppText style={styles.miniBtnText}>Tutup</AppText>
              </TouchableOpacity>
            </View>
          )}
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

      {/* MODAL BOTTOM SHEET FILTER (SLIDE DARI BAWAH) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterOpen}
        onRequestClose={() => setIsFilterOpen(false)}
      >
        <View style={styles.sheetOverlay}>
          {/* Sisi atas overlay transparan agar bisa di-klik untuk menutup */}
          <TouchableOpacity 
            style={styles.sheetCloseArea} 
            activeOpacity={1} 
            onPress={() => setIsFilterOpen(false)} 
          />
          
          {/* KONTEN UTAMA BOTTOM SHEET */}
          <View style={styles.sheetContent}>
            <View style={styles.sheetHeader}>
              <AppText variant="bodyStrong" style={styles.sheetTitle}>Saring Generasi</AppText>
              <TouchableOpacity 
                style={styles.sheetCloseBtn}
                onPress={() => setIsFilterOpen(false)}
              >
                <X color="#8a8a8e" size={18} />
              </TouchableOpacity>
            </View>

            {/* DAFTAR OPSI FILTER */}
            <View style={styles.optionsWrapper}>
              {genOptions.map((opt, idx) => {
                const isSelected = selectedGen === opt.value;
                return (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.7}
                    style={[styles.optionItem, isSelected && styles.optionItemActive]}
                    onPress={() => {
                      setSelectedGen(opt.value);
                      setIsFilterOpen(false); // Otomatis tutup sheet
                      if (opt.value !== null) handleToggleAll(true); // Auto-expand jika filter aktif
                    }}
                  >
                    <AppText style={[styles.optionText, isSelected && styles.optionTextActive]}>
                      {opt.label}
                    </AppText>
                    {isSelected && <Check size={16} color={colors.primary} strokeWidth={3} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.background,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  searchInput: {
    height: 42,
    backgroundColor: '#e9e9eb',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    color: '#000',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  filterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e1f0ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
    maxWidth: '55%',
  },
  filterBadgeActive: {
    backgroundColor: colors.primary,
    paddingRight: 8,
  },
  filterBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 6,
  },
  filterBadgeTextActive: {
    color: colors.surface,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    maxWidth: '45%',
  },
  miniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f7',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    marginLeft: 6,
    marginLeft: 4,
  },
  miniBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#48484a',
    marginLeft: 3,
  },
  listContent: {
    paddingVertical: spacing.xs,
    paddingBottom: spacing.xl * 3,
  },

  // STYLES KHUSUS BOTTOM SHEET FILTER
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 44, 140, 0.2)', // Efek backdrop redup tipis
    justifyContent: 'flex-end', // Mengunci modal agar nempel di dasar layar
  },
  sheetCloseArea: {
    flex: 1,
  },
  sheetContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    paddingBottom: spacing.xl * 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 15,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryDeep,
  },
  sheetCloseBtn: {
    backgroundColor: '#f2f2f7',
    padding: 4,
    borderRadius: 50,
  },
  optionsWrapper: {
    marginTop: spacing.xs,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
  },
  optionItemActive: {
    borderBottomColor: colors.primaryLight,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#48484a',
  },
  optionTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  resetIconWrapper: {
    marginLeft: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)', // Efek lingkaran semi transparan yang modis
    borderRadius: 50,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});