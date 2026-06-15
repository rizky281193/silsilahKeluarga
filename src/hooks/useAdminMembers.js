import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { getMembers, insertMember } from '../services/memberService.js';
import { supabase } from '../config/supabase'; 
import * as ImagePicker from 'expo-image-picker';

export function useAdminMembers() {
  const [allMembers, setAllMembers] = useState([]);
  const [search, setSearch] = useState('');
  
  // State Manajemen Modal Form
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editMemberId, setEditMemberId] = useState(null); 

  // State Input Form
  const [name, setName] = useState('');
  const [gender, setGender] = useState('M'); 
  const [isAlive, setIsAlive] = useState(true);
  const [biography, setBiography] = useState(''); // State lokal tetap biography agar aman di form
  const [photoUrl, setPhotoUrl] = useState(null); 

  // State Relasi Silsilah
  const [relationType, setRelationType] = useState('anak'); 
  const [fatherId, setFatherId] = useState(null);
  const [fatherSearch, setFatherSearch] = useState('');
  const [filteredFathers, setFilteredFathers] = useState([]);

  const [motherId, setMotherId] = useState(null);
  const [motherSearch, setMotherSearch] = useState('');
  const [filteredMothers, setFilteredMothers] = useState([]);

  const [spouseId, setSpouseId] = useState(null);
  const [spouseSearch, setSpouseSearch] = useState('');
  const [filteredSpouses, setFilteredSpouses] = useState([]);

  const loadData = async () => {
    try {
      const data = await getMembers();
      setAllMembers(data);
    } catch (err) {
      console.log('Gagal ambil data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin Ditolak', 'Aplikasi butuh akses galeri untuk memilih foto, Bos!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, 
      aspect: [1, 1], 
      quality: 0.6, 
    });

    if (!result.canceled) {
      setPhotoUrl(result.assets[0].uri); 
    }
  };

  const handleEditPress = (item) => {
    setEditMemberId(item.id); 
    setName(item.name);
    setGender(item.gender || 'M');
    setIsAlive(item.is_alive);
    setBiography(item.biografi || ''); // PERBAIKAN: Membaca kolom 'biografi' database dengan benar
    setPhotoUrl(item.photo_url || null); 

    if (item.spouse_id) {
      setRelationType('pasangan');
      setSpouseId(item.spouse_id);
      const spouseData = allMembers.find(m => m.id === item.spouse_id);
      setSpouseSearch(spouseData ? `${spouseData.name} (Terkunci)` : 'Pasangan Terpilih');
    } else {
      setRelationType('anak');
      setFatherId(item.father_id);
      const fatherData = allMembers.find(m => m.id === item.father_id);
      setFatherSearch(fatherData ? `${fatherData.name} (Terkunci)` : '');
      setMotherId(item.mother_id);
      const motherData = allMembers.find(m => m.id === item.mother_id);
      setMotherSearch(motherData ? `${motherData.name} (Terkunci)` : '');
    }

    setModalVisible(true); 
  };

  const handleDeletePress = (item) => {
    Alert.alert(
      'Hapus Anggota', 
      `Apakah Anda yakin ingin menghapus "${item.name}" dari data silsilah keluarga, Bos?`, 
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Ya, Hapus', 
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase.from('members').delete().eq('id', item.id);
              if (error) throw error;
              Alert.alert('Sukses', `Data ${item.name} berhasil dihapus permanen.`);
              loadData();
            } catch (error) {
              Alert.alert('Gagal Menghapus', error.message);
            }
          } 
        }
      ]
    );
  };

  const closeAndResetForm = () => {
    setEditMemberId(null);
    setName('');
    setGender('M');
    setIsAlive(true);
    setBiography('');
    setPhotoUrl(null); 
    setRelationType('anak');
    setFatherId(null);
    setFatherSearch('');
    setFilteredFathers([]);
    setMotherId(null);
    setMotherSearch('');
    setFilteredMothers([]);
    setSpouseId(null);
    setSpouseSearch('');
    setFilteredSpouses([]);
    setModalVisible(false);
  };

  const uploadImageToSupabase = async (localUri) => {
    try {
      const response = await fetch(localUri);
      const blob = await response.blob();
      
      const fileExt = localUri.split('.').pop().toLowerCase() || 'jpeg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `avatars/${fileName}`; // Struktur path folder internal bucket

      const contentType = blob.type || `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`;

      const { data, error } = await supabase.storage
        .from('family-photos') 
        .upload(filePath, blob, {
          contentType: contentType,
          upsert: true
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('family-photos')
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.log('Error uploadImageToSupabase:', err);
      throw new Error('Gagal mengunggah gambar profil ke storage cloud.');
    }
  };

  const handleSaveMember = async () => {
    if (!name.trim()) {
      Alert.alert('Eror', 'Nama Lengkap wajib diisi ya, Bos!');
      return;
    }

    setSubmitting(true);
    try {
      let finalPhotoUrl = photoUrl;

      // Logika upload mendeteksi file lokal baru dari media picker HP
      if (photoUrl && (photoUrl.startsWith('file://') || photoUrl.startsWith('content://') || photoUrl.startsWith('ph://'))) {
        finalPhotoUrl = await uploadImageToSupabase(photoUrl);
      }

      const payload = {
        name: name.trim(),
        gender: gender,
        is_alive: isAlive,
        biografi: biography.trim() || null, // PERBAIKAN: Menggunakan properti biography pengetikan lokal secara aman
        photo_url: finalPhotoUrl, 
        father_id: relationType === 'anak' ? fatherId : null,
        mother_id: relationType === 'anak' ? motherId : null,
        spouse_id: relationType === 'pasangan' ? spouseId : null,
      };

      if (editMemberId) {
        const { error } = await supabase.from('members').update(payload).eq('id', editMemberId);
        if (error) throw error;
        Alert.alert('Sukses', `Data ${name} berhasil diperbarui! ✨`);
      } else {
        await insertMember(payload);
        Alert.alert('Sukses', `Data ${name} berhasil disimpan ke cloud! 🎉`);
      }

      closeAndResetForm();
      loadData();
    } catch (error) {
      Alert.alert('Gagal Menyimpan', error.message || 'Terjadi kesalahan.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFatherTyping = (text) => {
    setFatherSearch(text);
    setFatherId(null);
    if (text.trim() === '') setFilteredFathers([]);
    else setFilteredFathers(allMembers.filter(m => m.name.toLowerCase().includes(text.toLowerCase()) && m.id !== editMemberId));
  };

  const handleMotherTyping = (text) => {
    setMotherSearch(text);
    setMotherId(null);
    if (text.trim() === '') setFilteredMothers([]);
    else setFilteredMothers(allMembers.filter(m => m.name.toLowerCase().includes(text.toLowerCase()) && m.id !== editMemberId));
  };

  const handleSpouseTyping = (text) => {
    setSpouseSearch(text);
    setSpouseId(null);
    if (text.trim() === '') setFilteredSpouses([]);
    else setFilteredSpouses(allMembers.filter(m => m.name.toLowerCase().includes(text.toLowerCase()) && m.id !== editMemberId));
  };

  return {
    allMembers, search, setSearch, modalVisible, setModalVisible, submitting,
    name, setName, gender, setGender, isAlive, setIsAlive, biography, setBiography,
    photoUrl, pickImage, 
    relationType, setRelationType,
    fatherSearch, setFatherId, filteredFathers, setFilteredFathers, setFatherSearch, handleFatherTyping,
    motherSearch, setMotherId, filteredMothers, setFilteredMothers, setMotherSearch, handleMotherTyping,
    spouseSearch, setSpouseId, filteredSpouses, setFilteredSpouses, setSpouseSearch, handleSpouseTyping,
    editMemberId, handleEditPress, closeAndResetForm, handleSaveMember, handleDeletePress
  };
}