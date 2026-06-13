<?php

namespace App\Services;

use App\Imports\MembersImport;
use App\Repositories\MemberRepository;
use App\Models\FamilyMember;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;

class SilsilahService
{
    protected $memberRepo;

    // Dependency Injection: Masukkan Repository ke dalam Service
    public function __construct(MemberRepository $memberRepo)
    {
        $this->memberRepo = $memberRepo;
    }

    /**
     * Logika utama merakit pohon silsilah
     */
    public function buildKeluargaTree(): array
    {
        $roots = $this->memberRepo->getRootLeluhur();
        $tree = [];

        foreach ($roots as $root) {
            $tree[] = $this->formatNodeRekursif($root);
        }

        return $tree;
    }

    /**
     * Fungsi pemrosesan rekursif cabang anak-cucu
     */
    private function formatNodeRekursif(FamilyMember $member): array
    {
        // Ambil data anak dari repository berdasarkan gender subjek
        $children = $member->gender === 'M'
            ? $this->memberRepo->getChildrenByFather($member->id)
            : $this->memberRepo->getChildrenByMother($member->id);

        $childrenArray = [];
        foreach ($children as $child) {
            // Rekursi memanggil dirinya sendiri ke level bawah berikutnya
            $childrenArray[] = $this->formatNodeRekursif($child);
        }

        return [
            'id' => $member->id,
            'name' => $member->name,
            'gender' => $member->gender,
            'birth_date' => $member->birth_date ? $member->birth_date->format('Y-m-d') : null,
            'is_alive' => $member->is_alive,
            'spouse' => $member->spouse ? [
                'id' => $member->spouse->id,
                'name' => $member->spouse->name,
                'gender' => $member->spouse->gender,
                'is_alive' => $member->spouse->is_alive,
            ] : null,
            'meta_data' => $member->meta_data,
            'children' => $childrenArray
        ];
    }

    /**
     * Fungsi memproses file Excel, melakukan validasi logika silsilah,
     * dan menyuntikkannya ke database secara aman (Database Transaction).
     */
    public function importSilsilahExcel($file, bool $overWriteTotal = true): array
    {
        // 1. Ekstrak data dari file Excel menjadi array PHP biasa agar mudah divalidasi secara horizontal
        // Menghasilkan array baris demi baris data
        $rows = Excel::toArray(new MembersImport, $file)[0];

        // Jika admin memilih untuk menimpa total data lama
        if ($overWriteTotal) {
            $this->memberRepo->truncateMembersTable();
        }

        // Gunakan Database Transaction agar jika ada 1 baris Excel yang melanggar logika,
        // seluruh proses dibatalkan total (data tidak korup atau setengah masuk)
        DB::beginTransaction();

        try {
            // Buat mapping lokal untuk mengecek tanggal lahir berdasarkan ID di Excel secara cepat
            $birthDateMap = [];
            foreach ($rows as $row) {
                if (isset($row['id']) && isset($row['birth_date'])) {
                    $birthDateMap[$row['id']] = $row['birth_date'];
                }
            }

            foreach ($rows as $index => $row) {
                // Lewati baris jika nama kosong
                if (empty($row['name'])) continue;

                $barisKe = $index + 1;

                // === HUKUM VALIDASI 1: ANTI-PARADOX LOOP ===
                if (!empty($row['father_id']) && $row['father_id'] == $row['id']) {
                    throw new Exception("Error Baris {$barisKe}: Logika cacat. Seseorang dengan ID {$row['id']} tidak boleh menjadi AYAH dari dirinya sendiri.");
                }
                if (!empty($row['mother_id']) && $row['mother_id'] == $row['id']) {
                    throw new Exception("Error Baris {$barisKe}: Logika cacat. Seseorang dengan ID {$row['id']} tidak boleh menjadi IBU dari dirinya sendiri.");
                }
                if (!empty($row['spouse_id']) && $row['spouse_id'] == $row['id']) {
                    throw new Exception("Error Baris {$barisKe}: Logika cacat. Seseorang dengan ID {$row['id']} tidak boleh MENIKAH dengan dirinya sendiri.");
                }

                // === HUKUM VALIDASI 2: KRONOLOGIS USIA (ANAK VS ORANG TUA) ===
                if (!empty($row['birth_date'])) {
                    $tglLahirAnak = Carbon::parse($row['birth_date']);

                    // Cek Usia Ayah
                    if (!empty($row['father_id']) && isset($birthDateMap[$row['father_id']])) {
                        $tglLahirAyah = Carbon::parse($birthDateMap[$row['father_id']]);
                        if ($tglLahirAnak->lt($tglLahirAyah)) {
                            throw new Exception("Error Baris {$barisKe}: Paradoks Waktu. Anak ({$row['name']}) lahir sebelum Ayahnya lahir.");
                        }
                    }
                    // Cek Usia Ibu
                    if (!empty($row['mother_id']) && isset($birthDateMap[$row['mother_id']])) {
                        $tglLahirIbu = Carbon::parse($birthDateMap[$row['mother_id']]);
                        if ($tglLahirAnak->lt($tglLahirIbu)) {
                            throw new Exception("Error Baris {$barisKe}: Paradoks Waktu. Anak ({$row['name']}) lahir sebelum Ibunya lahir.");
                        }
                    }
                }

                // Ekstrak kolom tambahan untuk dimasukkan ke JSON blob meta_data
                $metaData = [
                    'biografi' => $row['biografi'] ?? null,
                    'no_hp' => $row['no_hp'] ?? null,
                    'lokasi_makam' => $row['lokasi_makam'] ?? null,
                    'foto_url' => $row['foto_url'] ?? null,
                ];

                // Masukkan ke database melalui Repository
                $this->memberRepo->createMember([
                    'id' => $row['id'], // Mempertahankan ID unik dari Excel pilihan klan/keluarga
                    'name' => $row['name'],
                    'gender' => strtoupper($row['gender']),
                    'father_id' => $row['father_id'] ?: null,
                    'mother_id' => $row['mother_id'] ?: null,
                    'spouse_id' => $row['spouse_id'] ?: null,
                    'birth_date' => $row['birth_date'] ? Carbon::parse($row['birth_date']) : null,
                    'is_alive' => isset($row['is_alive']) ? (bool)$row['is_alive'] : true,
                    'meta_data' => $metaData
                ]);
            }

            DB::commit();

            return [
                'success' => true,
                'message' => 'Seluruh data Excel berhasil divalidasi dan diimport massal ke database.'
            ];
        } catch (Exception $e) {
            DB::rollBack();
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
}
