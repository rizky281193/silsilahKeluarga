<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('members', function (Blueprint $create) {
            $create->id(); // PK, BIGINT Auto Increment
            $create->string('name'); // Nama lengkap
            $create->enum('gender', ['M', 'F']); // M = Male, F = Female
            
            // Relasi Self-Referencing (Garis Keturunan & Pernikahan)
            // Menggunakan foreignId agar tipe datanya sinkron dengan kolom ID utama
            $create->foreignId('father_id')->nullable()->constrained('members')->onDelete('set null');
            $create->foreignId('mother_id')->nullable()->constrained('members')->onDelete('set null');
            $create->foreignId('spouse_id')->nullable()->constrained('members')->onDelete('set null');
            
            $create->date('birth_date')->nullable(); // Tanggal Lahir
            $create->boolean('is_alive')->default(true); // Status hidup/wafat
            
            // Kolom JSON untuk menampung blob data dinamis (Foto, Biografi, Kontak, Lokasi Makam)
            $create->json('meta_data')->nullable(); 
            
            $create->timestamps(); // otomatis membuat created_at dan updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};