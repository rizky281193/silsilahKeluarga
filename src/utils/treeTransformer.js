export const buildNestedTree = (members) => {
  if (!members || members.length === 0) return [];

  const memberMap = {};
  const spouseGroupMap = {}; 
  const nonRootIds = new Set();

  // 1. Daftarkan semua anggota ke dalam map pencarian
  members.forEach((member) => {
    memberMap[member.id] = { ...member, spouses: [], children: [] };
  });

  // 2. Tandai siapa saja yang berstatus sebagai pasangan/menantu agar tidak jadi root terluar
  members.forEach((member) => {
    const spouseId = member.spouse_id || (member.spouse ? member.spouse.id : null);
    
    if (spouseId) {
      nonRootIds.add(member.id);

      if (!spouseGroupMap[spouseId]) {
        spouseGroupMap[spouseId] = [];
      }
      spouseGroupMap[spouseId].push(memberMap[member.id]);
    }
  });

  const roots = [];

  // 3. SUSUN HIERARKI: Masukkan anak ke orang tua kandung (Bani Moenandar)
  members.forEach((member) => {
    const current = memberMap[member.id];
    
    // Tempelkan info pasangan jika ada
    if (spouseGroupMap[member.id]) {
      current.spouses = spouseGroupMap[member.id];
    }

    const fatherId = member.father_id || (member.father ? member.father.id : null);
    const motherId = member.mother_id || (member.mother ? member.mother.id : null);

    // Tandai anak agar tidak jadi root terluar jika punya orang tua
    if (fatherId || motherId) {
      nonRootIds.add(member.id);
    }

    // LOGIKA PENENTUAN ORANG TUA KANDUNG:
    let targetParentId = null;

    if (fatherId && memberMap[fatherId]) {
      const father = memberMap[fatherId];
      // Jika ayah BUKAN menantu (artinya dia darah kandung), jadikan dia target
      if (father.father_id || father.mother_id || father.id === 1) {
        targetParentId = fatherId;
      }
    }
    
    // Jika target belum ketemu lewat ayah, coba cek jalur ibu
    if (!targetParentId && motherId && memberMap[motherId]) {
      const mother = memberMap[motherId];
      // Jika ibu BUKAN menantu (artinya dia darah kandung), jadikan dia target
      if (mother.father_id || mother.mother_id) {
        targetParentId = motherId;
      }
    }

    // Jika dua-duanya tidak terdeteksi sebagai keturunan darah langsung (misal data gantung), 
    // kembalikan ke default jalur Ayah
    if (!targetParentId) {
      targetParentId = fatherId || motherId;
    }

    // Masukkan anak ke target orang tua yang sudah divalidasi
    if (targetParentId && memberMap[targetParentId]) {
      memberMap[targetParentId].children.push(current);
    } else {
      // Jika benar-benar tidak punya orang tua dan bukan menantu, dia adalah Root utama (Mas Moenandar)
      if (!nonRootIds.has(member.id)) {
        roots.push(current);
      }
    }
  });

  return roots;
};