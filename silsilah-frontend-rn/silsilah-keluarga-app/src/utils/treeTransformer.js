export const buildNestedTree = (members) => {
  if (!members || members.length === 0) return [];

  const memberMap = {};
  const spouseGroupMap = {}; // Untuk menampung daftar istri/suami (Poligami friendly)
  const childrenIds = new Set();
  const nonRootIds = new Set();

  // 1. Inisialisasi map pencarian dan deteksi relasi dasar
  members.forEach((member) => {
    memberMap[member.id] = { ...member, spouses: [], children: [] };
    
    // Catat semua ID yang berstatus sebagai anak kandung
    const fatherId = member.father_id || (member.father ? member.father.id : null);
    const motherId = member.mother_id || (member.mother ? member.mother.id : null);
    
    if (fatherId) childrenIds.add(member.id);
    
    // Jika punya orang tua, dia otomatis bukan Root terluar
    if (fatherId || motherId) {
      nonRootIds.add(member.id);
    }
  });

  // 2. Kelompokkan Pasangan (Spouse) untuk mendukung Poligami/Multi-istri
  members.forEach((member) => {
    const spouseId = member.spouse_id || (member.spouse ? member.spouse.id : null);
    
    if (spouseId) {
      // Seseorang yang berstatus pasangan (menantu/istri luar) tidak boleh jadi Root utama
      nonRootIds.add(member.id);

      if (!spouseGroupMap[spouseId]) {
        spouseGroupMap[spouseId] = [];
      }
      // Masukkan objek pasangan ke dalam grup ID pasangannya
      spouseGroupMap[spouseId].push(memberMap[member.id]);
    }
  });

  const roots = [];

  // 3. Susun Struktur Pohon Silsilah Akhir
  members.forEach((member) => {
    const current = memberMap[member.id];
    
    // Tempelkan daftar pasangan jika ada (Poligami terbaca di sini)
    if (spouseGroupMap[member.id]) {
      current.spouses = spouseGroupMap[member.id];
    }

    const fatherId = member.father_id || (member.father ? member.father.id : null);
    const motherId = member.mother_id || (member.mother ? member.mother.id : null);

    if (fatherId && memberMap[fatherId]) {
      // Masukkan anak ke baris Ayah (Jangkar Utama)
      memberMap[fatherId].children.push(current);
    } else if (motherId && memberMap[motherId] && !fatherId) {
      // Jalur cadangan: jika hanya ada data ibu, masukkan ke baris Ibu
      memberMap[motherId].children.push(current);
    } else {
      // Jika tidak punya orang tua dan tidak ditandai sebagai non-root (seperti Mas Moenandar)
      if (!nonRootIds.has(member.id)) {
        roots.push(current);
      }
    }
  });

  return roots;
};