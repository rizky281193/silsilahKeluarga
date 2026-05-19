<?php

namespace App\Console\Commands;

use App\Imports\SilsilahExport;
use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;

class GenerateTemplate extends Command
{
    protected $signature = 'silsilah:make-template';
    protected $description = 'Membuat file template Excel (.xlsx) 2 sheet resmi untuk silsilah keluarga';

    public function handle()
    {
        // Langsung arahkan Maatwebsite Excel untuk menulis file di folder public sejak awal
        // Kita gunakan trik 'raw' disk agar tidak terikat batasan default storage Laravel
        $publicPath = public_path('Template_Silsilah_Keluarga.xlsx');

        try {
            // Hapus file fisik lama jika ada ganjalan hak akses
            if (file_exists($publicPath)) {
                unlink($publicPath);
            }

            // Tembak langsung pembuatan file ke jalur folder public
            Excel::store(new \App\Imports\SilsilahExport(), 'Template_Silsilah_Keluarga.xlsx', 'real_public');

            $this->info("SUKSES: File True Excel (.xlsx) 2 Sheet berhasil dibuat!");
            $this->info("Silakan unduh langsung di browser: http://localhost:8000/Template_Silsilah_Keluarga.xlsx");

        } catch (\Exception $e) {
            // Jika seandainya disk 'real_public' belum terdaftar, kita gunakan backup stream langsung
            try {
                Excel::download(new \App\Imports\SilsilahExport(), 'Template_Silsilah_Keluarga.xlsx')
                     ->getFile()
                     ->move(public_path(), 'Template_Silsilah_Keluarga.xlsx');
                
                $this->info("SUKSES (via Backup Stream): File Excel berhasil dibuat!");
                $this->info("Silakan unduh di browser: http://localhost:8000/Template_Silsilah_Keluarga.xlsx");
            } catch (\Exception $e2) {
                $this->error("Gagal total karena masalah sistem Linux: " . $e2->getMessage());
            }
        }
    }
}