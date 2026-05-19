<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class SilsilahExport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            new SilsilahSheetExport('Template_Silsilah', true),
            new SilsilahSheetExport('Contoh_Isian_Valid', false),
        ];
    }
}

class SilsilahSheetExport implements FromArray, WithHeadings, WithTitle
{
    private $title;
    private $isTemplate;

    public function __construct(string $title, bool $isTemplate)
    {
        $this->title = $title;
        $this->isTemplate = $isTemplate;
    }

    public function title(): string
    {
        return $this->title;
    }

    public function headings(): array
    {
        return [
            'id', 'name', 'gender', 'father_id', 'mother_id', 'spouse_id', 
            'birth_date', 'is_alive', 'biografi', 'no_hp', 'lokasi_makam', 'foto_url'
        ];
    }

    public function array(): array
    {
        if ($this->isTemplate) {
            return [
                [1, '', '', '', '', '', 'YYYY-MM-DD', 1, '', '', '', '']
            ];
        }

        return [
            [1, 'Kakek Ahmad', 'M', '', '', 2, '1950-01-01', 0, 'Perintis keluarga besar pertama.', '', 'TPU Jeruk Purut', ''],
            [2, 'Nenek Aminah', 'F', '', '', 1, '1953-05-12', 1, 'Gemar memasak kue tradisional.', '08123456789', '', ''],
            [3, 'Ayah Budi', 'M', 1, 2, 4, '1978-08-20', 1, 'Anak dari Kakek Ahmad.', '', '', 'https://api.silsilah.com/storage/budi.jpg'],
            [4, 'Ibu Citra', 'F', '', '', 3, '1982-03-15', 1, 'Menikah dengan Ayah Budi.', '', '', ''],
            [5, 'Anak Pertama (Deni)', 'M', 3, 4, '', '2010-11-05', 1, 'Cucu pertama, sekolah di SMP 1.', '', '', ''],
            [6, 'Anak Kedua (Eka)', 'F', 3, 4, '', '2014-02-25', 1, 'Cucu kedua.', '', '', '']
        ];
    }
}