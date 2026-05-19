<?php

namespace App\Services;

use App\Repositories\MemberRepository;
use App\Models\Member;

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
    private function formatNodeRekursif(Member $member): array
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
}