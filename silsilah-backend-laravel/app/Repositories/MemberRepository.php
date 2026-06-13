<?php

namespace App\Repositories;

use App\Models\FamilyMember;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class MemberRepository
{
    /**
     * Mengambil semua pucuk leluhur teratas (Akar Silsilah)
     */
    public function getRootLeluhur(): Collection
    {
        return FamilyMember::whereNull('father_id')
            ->whereNull('mother_id')
            ->where(function ($query) {
                $query->whereNull('spouse_id')
                    ->orWhere('gender', 'M');
            })
            ->with(['spouse'])
            ->get();
    }

    /**
     * Mengambil anak-anak dari seorang ayah beserta pasangannya
     */
    public function getChildrenByFather(int $fatherId): Collection
    {
        return FamilyMember::where('father_id', $fatherId)
            ->with(['spouse'])
            ->get();
    }

    /**
     * Mengambil anak-anak dari seorang ibu beserta pasangannya
     */
    public function getChildrenByMother(int $motherId): Collection
    {
        return FamilyMember::where('mother_id', $motherId)
            ->with(['spouse'])
            ->get();
    }

    /**
     * Mengosongkan seluruh data silsilah lama (Truncate)
     * Digunakan jika admin ingin melakukan import ulang bersih dari nol
     */
    public function truncateMembersTable(): void
    {
        // Menggunakan DB statement untuk mengabaikan foreign key check sementara saat proses bersihkan data
        DB::statement('TRUNCATE TABLE members RESTART IDENTITY CASCADE');
    }

    /**
     * Memasukkan satu baris data member baru ke database
     */
    public function createMember(array $data): FamilyMember
    {
        return FamilyMember::create($data);
    }
}
