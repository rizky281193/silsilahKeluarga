<?php

namespace Database\Seeders;

use App\Models\Member;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class MemberSeeder extends Seeder
{
    public function run(): void
    {
        // === GENERASI 1: KAKEK & NENEK ===
        $kakek = Member::create([
            'name' => 'Kakek Ahmad',
            'gender' => 'M',
            'birth_date' => Carbon::parse('1950-01-01'),
            'is_alive' => false,
            'meta_data' => ['biografi' => 'Perintis keluarga besar pertama.', 'lokasi_makam' => 'TPU Jeruk Purut']
        ]);

        $nenek = Member::create([
            'name' => 'Nenek Aminah',
            'gender' => 'F',
            'birth_date' => Carbon::parse('1953-05-12'),
            'is_alive' => true,
            'spouse_id' => $kakek->id, // Hubungan pernikahan simetris
            'meta_data' => ['no_hp' => '08123456789']
        ]);

        // Update balik pasangannya si kakek agar terikat dua arah
        $kakek->update(['spouse_id' => $nenek->id]);


        // === GENERASI 2: AYAH & IBU (Anak dari Kakek/Nenek) ===
        $ayah = Member::create([
            'name' => 'Ayah Budi',
            'gender' => 'M',
            'father_id' => $kakek->id, // Anak dari Kakek Ahmad
            'mother_id' => $nenek->id, // Anak dari Nenek Aminah
            'birth_date' => Carbon::parse('1978-08-20'),
            'is_alive' => true,
            'meta_data' => ['foto_url' => 'https://api.silsilah.com/storage/budi.jpg']
        ]);

        $ibu = Member::create([
            'name' => 'Ibu Citra',
            'gender' => 'F',
            'birth_date' => Carbon::parse('1982-03-15'),
            'is_alive' => true,
            'spouse_id' => $ayah->id, // Menikah dengan Ayah Budi
            'meta_data' => ['pekerjaan' => 'Wiraswasta']
        ]);

        $ayah->update(['spouse_id' => $ibu->id]);


        // === GENERASI 3: ANAK-ANAK (Cucu dari Kakek/Nenek) ===
        Member::create([
            'name' => 'Anak Pertama (Deni)',
            'gender' => 'M',
            'father_id' => $ayah->id,
            'mother_id' => $ibu->id,
            'birth_date' => Carbon::parse('2010-11-05'),
            'is_alive' => true
        ]);

        Member::create([
            'name' => 'Anak Kedua (Eka)',
            'gender' => 'F',
            'father_id' => $ayah->id,
            'mother_id' => $ibu->id,
            'birth_date' => Carbon::parse('2014-02-25'),
            'is_alive' => true
        ]);
    }
}