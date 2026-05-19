<?php

namespace App\Imports;

use App\Models\Member;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class MembersImport implements ToModel, WithHeadingRow
{
    /**
     * Map data per baris Excel ke Model Laravel
     */
    public function model(array $row)
    {
        // Kita tidak melakukan insert di sini, karena proses insert 
        // dan validasi ketat sudah kita pindahkan ke SilsilahService.php
        return null;
    }
}