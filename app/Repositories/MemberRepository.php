<?php

namespace App\Repositories;

use App\Models\Member;
use Illuminate\Database\Eloquent\Collection;

class MemberRepository
{
    /**
     * Mengambil semua pucuk leluhur teratas (Akar Silsilah)
     */
    public function getRootLeluhur(): Collection
    {
        return Member::whereNull('father_id')
            ->whereNull('mother_id')
            ->where(function($query) {
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
        return Member::where('father_id', $fatherId)
            ->with(['spouse'])
            ->get();
    }

    /**
     * Mengambil anak-anak dari seorang ibu beserta pasangannya
     */
    public function getChildrenByMother(int $motherId): Collection
    {
        return Member::where('mother_id', $motherId)
            ->with(['spouse'])
            ->get();
    }
}