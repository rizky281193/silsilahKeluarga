import React from 'react';
import { 
  StyleSheet, 
  View, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  ScrollView, 
  Switch,
  ActivityIndicator,
  Image // <-- Pastikan Image di-import di sini
} from 'react-native';
import AppText from '../components/atoms/AppText';
import { spacing } from '../theme/tokens';
import { UserPlus, Edit, Trash2, Search, X, Check, Camera } from 'lucide-react-native'; // <-- Tambah Camera
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAdminMembers } from '../hooks/useAdminMembers';

export default function AdminMembersPage() {
  const insets = useSafeAreaInsets();
  
  const {
    allMembers, search, setSearch, modalVisible, setModalVisible, submitting,
    name, setName, gender, setGender, isAlive, setIsAlive, biography, setBiography,
    photoUrl, pickImage, // <-- Ambil state & fungsi gambar dari hook
    relationType, setRelationType,
    fatherSearch, filteredFathers, setFilteredFathers, setFatherId, setFatherSearch, handleFatherTyping,
    motherSearch, filteredMothers, setFilteredMothers, setMotherId, setMotherSearch, handleMotherTyping,
    spouseSearch, filteredSpouses, setFilteredSpouses, setSpouseId, setSpouseSearch, handleSpouseTyping,
    editMemberId, handleEditPress, closeAndResetForm, handleSaveMember, handleDeletePress
  } = useAdminMembers();

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER UTAMA */}
      <View style={styles.header}>
        <AppText variant="bodyStrong" style={styles.headerTitle}>Manajemen Anggota</AppText>
        <AppText variant="body" style={styles.headerSub}>Kelola data silsilah Bani Moenandar</AppText>
      </View>

      {/* TOMBOL TAMBAH DATA */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <UserPlus color="#ffffff" size={20} style={{ marginRight: 8 }} />
        <AppText variant="bodyStrong" style={styles.addButtonText}>Tambah Anggota Keluarga</AppText>
      </TouchableOpacity>

      {/* SEARCH BAR DASHBOARD */}
      <View style={styles.searchContainer}>
        <Search color="#a2a2a7" size={18} style={{ marginRight: 8 }} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Cari nama yang ingin diubah/dihapus..."
          placeholderTextColor="#a2a2a7"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* LIST DATA DASHBOARD UTAMA */}
      <FlatList 
        data={allMembers.filter(m => m.name.toLowerCase().includes(search.toLowerCase()))}
        keyExtractor={(item) => 'dash-' + item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.memberCard, { borderLeftColor: item.gender === 'M' ? '#2f54eb' : '#ff85c0' }]}>
            
            {/* TAMPILAN BARU: AVATAR FOTO PROFIL DI SISI KIRI CARD DASHBOARD */}
            <Image 
              source={item.photo_url ? { uri: item.photo_url } : (item.gender === 'M' ? 
                { uri: 'https://api.dicebear.com/7.x/bottts/png?seed=male&backgroundColor=d9e8ff' } : 
                { uri: 'https://api.dicebear.com/7.x/bottts/png?seed=female&backgroundColor=ffd6e7' }) // PERBAIKAN: Ganti warna background perempuan ke pink ffd6e7
              } 
              style={styles.cardAvatar} 
            />

            <View style={{ flex: 1, paddingRight: 12 }}>
              <AppText variant="bodyStrong" style={styles.memberName}>{item.name}</AppText>
              <AppText variant="body" style={styles.memberMeta}>
                {item.gender === 'M' ? '👨 Laki-laki' : '👩 Perempuan'} • {item.is_alive ? '🟢 Hidup' : '⚫ Wafat'}
              </AppText>
            </View>
            <View style={styles.actionRow}>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#e6f7ff' }]} onPress={() => handleEditPress(item)}>
                <Edit color="#1890ff" size={16} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#fff1f0' }]} onPress={() => handleDeletePress(item)}>
                <Trash2 color="#f5222d" size={16} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* ─── MODAL DIALOG POP-UP FORM INPUT UTAMA ─── */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeAndResetForm}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={styles.modalHeader}>
              <AppText variant="bodyStrong" style={styles.modalTitle}>
                {editMemberId ? 'Ubah Data Anggota' : 'Anggota Baru'}
              </AppText>
              <TouchableOpacity onPress={closeAndResetForm} disabled={submitting}>
                <X color="#595959" size={22} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false} 
              keyboardShouldPersistTaps="always"
              contentContainerStyle={{ paddingBottom: insets.bottom > 0 ? insets.bottom + 40 : 50 }}
            >
              
              {/* FORM BARU: SLOT UNTUK MEMILIH DAN MEMPRATINJAU FOTO PROFIL */}
              <View style={styles.avatarPickerContainer}>
                <TouchableOpacity style={styles.avatarFrame} onPress={pickImage} disabled={submitting}>
                  {photoUrl ? (
                    <Image source={{ uri: photoUrl }} style={styles.avatarPreview} />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      {/* Menggunakan URL avatar netral sebagai placeholder */}
                      <Image 
                        source={{ uri: 'https://api.dicebear.com/7.x/initials/png?seed=BM&backgroundColor=f5f5f5' }} 
                        style={styles.avatarPreview} 
                      />
                    </View>
                  )}
                  <View style={styles.cameraIconBadge}>
                    <Camera color="#ffffff" size={12} />
                  </View>
                </TouchableOpacity>
              </View>

              <AppText variant="bodyStrong" style={styles.label}>Nama Lengkap</AppText>
              <TextInput style={styles.inputBox} placeholder="Contoh: Raden Mas Rian..." placeholderTextColor="#a2a2a7" value={name} onChangeText={setName} disabled={submitting} />

              <AppText variant="bodyStrong" style={styles.label}>Jenis Kelamin (Gender)</AppText>
              <View style={styles.relationSegmentRow}>
                <TouchableOpacity style={[styles.segmentBtn, gender === 'M' && styles.segmentBtnActive]} onPress={() => setGender('M')} disabled={submitting}>
                  <AppText variant="bodyStrong" style={[styles.segmentText, gender === 'M' && styles.segmentTextActive]}>Laki-laki</AppText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.segmentBtn, gender === 'F' && styles.segmentBtnActive]} onPress={() => setGender('F')} disabled={submitting}>
                  <AppText variant="bodyStrong" style={[styles.segmentText, gender === 'F' && styles.segmentTextActive]}>Perempuan</AppText>
                </TouchableOpacity>
              </View>

              <AppText variant="bodyStrong" style={styles.label}>Status Hubungan</AppText>
              <View style={styles.relationSegmentRow}>
                <TouchableOpacity style={[styles.segmentBtn, relationType === 'anak' && styles.segmentBtnActive]} onPress={() => setRelationType('anak')} disabled={submitting}>
                  <AppText variant="bodyStrong" style={[styles.segmentText, relationType === 'anak' && styles.segmentTextActive]}>Anak</AppText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.segmentBtn, relationType === 'pasangan' && styles.segmentBtnActive]} onPress={() => setRelationType('pasangan')} disabled={submitting}>
                  <AppText variant="bodyStrong" style={[styles.segmentText, relationType === 'pasangan' && styles.segmentTextActive]}>Pasangan</AppText>
                </TouchableOpacity>
              </View>

              {relationType === 'anak' && (
                <View style={styles.conditionalBlock}>
                  <AppText variant="bodyStrong" style={styles.label}>Nama Ayah</AppText>
                  <TextInput style={styles.inputBox} placeholder="Ketik nama ayah kandung..." placeholderTextColor="#a2a2a7" value={fatherSearch} onChangeText={handleFatherTyping} disabled={submitting} />
                  {filteredFathers.length > 0 && (
                    <View style={styles.autoCompleteDropdown}>
                      {filteredFathers.slice(0, 4).map((item) => (
                        <TouchableOpacity 
                          key={'f-'+item.id} 
                          style={styles.autoCompleteItem}
                          onPress={() => {
                            setFatherId(item.id);
                            setFatherSearch(item.name + " (Terkunci)");
                            setFilteredFathers([]);
                          }}
                        >
                          <AppText variant="body" style={styles.autoCompleteText}>{item.name} <AppText style={{fontSize: 11, color: '#8c8c8c'}}>{item.gender === 'M' ? '👨' : '👩'}</AppText></AppText>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  <AppText variant="bodyStrong" style={styles.label}>Nama Ibu</AppText>
                  <TextInput style={styles.inputBox} placeholder="Ketik nama ibu kandung..." placeholderTextColor="#a2a2a7" value={motherSearch} onChangeText={handleMotherTyping} disabled={submitting} />
                  {filteredMothers.length > 0 && (
                    <View style={styles.autoCompleteDropdown}>
                      {filteredMothers.slice(0, 4).map((item) => (
                        <TouchableOpacity 
                          key={'m-'+item.id} 
                          style={styles.autoCompleteItem}
                          onPress={() => {
                            setMotherId(item.id);
                            setMotherSearch(item.name + " (Terkunci)");
                            setFilteredMothers([]);
                          }}
                        >
                          <AppText variant="body" style={styles.autoCompleteText}>{item.name} <AppText style={{fontSize: 11, color: '#8c8c8c'}}>{item.gender === 'M' ? '👨' : '👩'}</AppText></AppText>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              )}

              {relationType === 'pasangan' && (
                <View style={styles.conditionalBlock}>
                  <AppText variant="bodyStrong" style={styles.label}>Hubungan Pasangan Dengan</AppText>
                  <TextInput style={styles.inputBox} placeholder="Ketik nama pasangan hidupnya..." placeholderTextColor="#a2a2a7" value={spouseSearch} onChangeText={handleSpouseTyping} disabled={submitting} />
                  {filteredSpouses.length > 0 && (
                    <View style={styles.autoCompleteDropdown}>
                      {filteredSpouses.slice(0, 4).map((item) => (
                        <TouchableOpacity 
                          key={'s-'+item.id} 
                          style={styles.autoCompleteItem}
                          onPress={() => {
                            setSpouseId(item.id);
                            setSpouseSearch(item.name + " (Terkunci)");
                            setFilteredSpouses([]);
                          }}
                        >
                          <AppText variant="body" style={styles.autoCompleteText}>{item.name} <AppText style={{fontSize: 11, color: '#8c8c8c'}}>{item.gender === 'M' ? '👨' : '👩'}</AppText></AppText>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              )}

              <View style={styles.switchRow}>
                <View>
                  <AppText variant="bodyStrong" style={styles.label}>Status Keberadaan</AppText>
                  <AppText variant="body" style={{ fontSize: 13, color: '#8c8c8c' }}>{isAlive ? '🟢 Masih Hidup' : '⚫ Sudah Wafat'}</AppText>
                </View>
                <Switch value={isAlive} onValueChange={setIsAlive} trackColor={{ false: '#ffccc7', true: '#b7eb8f' }} thumbColor={isAlive ? '#52c41a' : '#f5222d'} disabled={submitting} />
              </View>

              <AppText variant="bodyStrong" style={styles.label}>Biografi / Catatan Singkat</AppText>
              <TextInput style={[styles.inputBox, { minHeight: 70, textAlignVertical: 'top', paddingTop: 10 }]} placeholder="Tulis catatan penting keluarga jika ada..." placeholderTextColor="#a2a2a7" value={biography} onChangeText={setBiography} multiline numberOfLines={2} disabled={submitting} />

              <TouchableOpacity style={[styles.submitButton, submitting && { backgroundColor: '#adc6ff' }]} onPress={handleSaveMember} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#ffffff" /> : (
                  <>
                    <Check color="#ffffff" size={18} style={{ marginRight: 6 }} />
                    <AppText variant="bodyStrong" style={styles.submitButtonText}>
                      {editMemberId ? 'Simpan Perubahan' : 'Simpan ke Cloud'}
                    </AppText>
                  </>
                )}
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f5ff', paddingHorizontal: spacing.lg },
  header: { marginTop: spacing.md, marginBottom: spacing.md },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#001d66' },
  headerSub: { fontSize: 13, color: '#595959' },
  addButton: { backgroundColor: '#2f54eb', flexDirection: 'row', height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md, elevation: 2 },
  addButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 12, paddingHorizontal: 12, height: 44, marginBottom: spacing.md, borderWidth: 1, borderColor: '#e8e8e8' },
  searchInput: { flex: 1, fontSize: 14, color: '#1f1f1f' },
  memberCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', padding: 12, borderRadius: 16, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#2f54eb', elevation: 1 },
  cardAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f5f5f5', marginRight: 12, borderWidth: 1, borderColor: '#f0f0f0' }, // STYLING AVATAR CARD
  memberName: { fontSize: 15, fontWeight: '700', color: '#1f1f1f' },
  memberMeta: { fontSize: 12, color: '#8c8c8c', marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 29, 102, 0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 24, paddingTop: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#001d66' },
  avatarPickerContainer: { alignItems: 'center', marginVertical: 8 }, // STYLING PICKER IMAGE MODAL
  avatarFrame: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#2f54eb', borderStyle: 'dashed', position: 'relative', overflow: 'visible' },
  avatarPreview: { width: 86, height: 86, borderRadius: 43 },
  avatarPlaceholder: { alignItems: 'center' },
  avatarPlaceholderText: { fontSize: 11, color: '#a2a2a7', marginTop: 4, fontWeight: '600' },
  cameraIconBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#2f54eb', width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', borderHex: '#ffffff', borderWidth: 2 },
  label: { fontSize: 11, fontWeight: '700', color: '#002c8c', marginTop: 12, marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.3 },
  inputBox: { backgroundColor: '#f5f5f5', borderRadius: 12, paddingHorizontal: 14, height: 44, fontSize: 14, color: '#1f1f1f', borderWidth: 1, borderColor: '#e8e8e8' },
  relationSegmentRow: { flexDirection: 'row', backgroundColor: '#f0f5ff', padding: 4, borderRadius: 12, borderWidth: 1, borderColor: '#adc6ff', marginBottom: 4 },
  segmentBtn: { flex: 1, height: 38, justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  segmentBtnActive: { backgroundColor: '#2f54eb', elevation: 1 },
  segmentText: { fontSize: 13, color: '#2f54eb', fontWeight: '600' },
  segmentTextActive: { color: '#ffffff', fontWeight: '700' },
  conditionalBlock: { backgroundColor: '#fafafa', padding: 12, borderRadius: 14, borderWidth: 1, borderColor: '#f0f0f0', marginTop: 4 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  submitButton: { backgroundColor: '#2f54eb', flexDirection: 'row', height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 18, elevation: 2 },
  submitButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  autoCompleteDropdown: { backgroundColor: '#ffffff', borderRadius: 12, marginTop: 4, borderWidth: 1, borderColor: '#d9d9d9', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 6, overflow: 'hidden' },
  autoCompleteItem: { paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  autoCompleteText: { fontSize: 14, color: '#1f1f1f', fontWeight: '500' }
});