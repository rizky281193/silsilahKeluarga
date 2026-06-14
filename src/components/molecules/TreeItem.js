import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, ScrollView, Image } from 'react-native';
import MemberCard from '../organisms/MemberCard';
import AppText from '../atoms/AppText';
import { colors, spacing, radius } from '../../theme/tokens';
import { X, BookOpen, ShieldAlert } from 'lucide-react-native';

export default function TreeItem({ node, level = 0, searchQuery = '', expandTrigger }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const hasChildren = node.children && node.children.length > 0;
  const indentSize = level * spacing.md;

  // Fungsi cerdas auto-expand jika anak di bawahnya cocok dengan teks search pencarian
  const hasMatchingChild = (item, query) => {
    if (!query) return false;
    if (!item.children) return false;
    return item.children.some(child => 
      child.name.toLowerCase().includes(query.toLowerCase()) || 
      hasMatchingChild(child, query)
    );
  };

  // 1. SYNC DENGAN TOMBOL BUKA/TUTUP SEMUA
  useEffect(() => {
    if (expandTrigger !== null) {
      setIsExpanded(expandTrigger);
    }
  }, [expandTrigger]);

  // 2. AUTO-EXPAND JIKA SEDANG SEARCH (Sudah bersih dari duplikasi)
  useEffect(() => {
    if (searchQuery && hasMatchingChild(node, searchQuery)) {
      setIsExpanded(true);
    }
  }, [searchQuery, node]);

  const isMatched = searchQuery && node.name.toLowerCase().includes(searchQuery.toLowerCase());

  const handleCardPress = (member) => {
    setSelectedMember(member);
    setIsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* BARIS UTAMA */}
      <View style={[styles.row, { paddingLeft: level * spacing.md }]}>
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

        <View style={[styles.cardContainer, isMatched && styles.matchedHighlight]}>
          <MemberCard member={node} level={level} onPress={handleCardPress} />
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
              searchQuery={searchQuery}
              expandTrigger={expandTrigger}
            />
          ))}
        </View>
      )}

      {/* POP-UP MODAL BIOGRAFI EKSKLUSIF */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setIsModalVisible(false)}
            >
              <X color="#8a8a8e" size={20} />
            </TouchableOpacity>

            {selectedMember && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.avatarRow}>
                  {selectedMember.photo_url ? (
                    // JIKA ADA FOTO: Tampilkan foto asli dari Supabase Storage
                    <Image 
                      source={{ uri: selectedMember.photo_url }} 
                      style={styles.avatarImage} 
                    />
                  ) : (
                    // JIKA TIDAK ADA FOTO: Tampilkan ikon fallback standar berdasarkan gender
                    <View style={[
                      styles.avatarCircle, 
                      { backgroundColor: selectedMember.gender === 'F' ? '#fff0f6' : '#e6f7ff' }
                    ]}>
                      <BookOpen color={selectedMember.gender === 'F' ? colors.female : colors.male} size={28} />
                    </View>
                  )}
                  <AppText variant="bodyStrong" style={styles.modalName}>{selectedMember.name}</AppText>
                  
                  <View style={[
                    styles.statusBadge, 
                    selectedMember.is_alive ? { backgroundColor: colors.aliveBg } : { backgroundColor: colors.deadBg }
                  ]}>
                    <AppText variant="caption" style={{ color: selectedMember.is_alive ? colors.aliveText : colors.deadText, fontWeight: '700' }}>
                      {selectedMember.is_alive ? 'HIDUP' : 'WAFAT'}
                    </AppText>
                  </View>
                </View>

                <View style={styles.modalDivider} />

                <AppText variant="bodyStrong" style={styles.biografiTitle}>Riwayat & Biografi</AppText>
                
                <View style={styles.biografiBox}>
                  <AppText variant="body" style={styles.biografiText}>
                    {selectedMember.biografi && selectedMember.biografi.trim() !== ""
                      ? selectedMember.biografi
                      : "Belum ada catatan riwayat hidup mendalam untuk anggota keluarga ini. Data biografi dapat diperbarui berkala oleh pengurus silsilah Bani Moenandar."}
                  </AppText>
                </View>

                <View style={styles.metaRow}>
                  <ShieldAlert size={14} color="#8a8a8e" style={{ marginRight: 6 }} />
                  <AppText variant="caption" style={styles.metaText}>
                    ID Sistem: {selectedMember.id} • Jalur Keturunan: {selectedMember.gender === 'M' ? 'Garis Bapak' : 'Garis Ibu'}
                  </AppText>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 8,
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
    color: '#8a8a8e',
  },
  spacer: {
    width: 30,
  },
  cardContainer: {
    flex: 1,
  },
  matchedHighlight: {
    backgroundColor: colors.highlight,
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
    backgroundColor: '#e5e5ea',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 44, 140, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    width: '100%',
    maxHeight: '75%',
    borderRadius: 24,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 10,
    backgroundColor: '#f2f2f7',
    padding: 6,
    borderRadius: 50,
  },
  avatarRow: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  avatarCircle: {
    padding: spacing.md,
    borderRadius: 50,
    marginBottom: spacing.sm,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45, // Membuat foto melingkar sempurna
    marginBottom: spacing.sm,
    borderWidth: 3,
    borderColor: '#f0f5ff', // Frame estetik tipis di sekeliling foto
  },
  modalName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryDeep,
    textAlign: 'center',
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: 50,
    marginTop: spacing.xs,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#f0f5ff',
    marginVertical: spacing.md,
  },
  biografiTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMain,
    marginBottom: spacing.xs,
  },
  biografiBox: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: radius.md,
    minHeight: 100,
  },
  biografiText: {
    fontSize: 14,
    color: '#3a3a3c',
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    justifyContent: 'center',
  },
  metaText: {
    fontSize: 11,
    color: '#8a8a8e',
  },
});