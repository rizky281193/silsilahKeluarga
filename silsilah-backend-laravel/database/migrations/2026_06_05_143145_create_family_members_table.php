<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('family_members', function (Blueprint $table) {
            $table->id(); // Ini akan otomatis membaca kolom 'id' (1, 2, 3... 240)
            $table->string('name');
            $table->enum('gender', ['M', 'F']);
            
            // Relasi self-referencing (merujuk ke tabel ini sendiri)
            // onDelete('set null') menjaga agar jika data orang tua terhapus, data anak tidak ikut terhapus
            $table->foreignId('father_id')->nullable()->constrained('family_members')->onDelete('set null');
            $table->foreignId('mother_id')->nullable()->constrained('family_members')->onDelete('set null');
            
            // Menyimpan ID Pasangan (String karena ada yang poligami/memiliki pasangan lebih dari satu)
            $table->string('spouse_id')->nullable(); 
            
            $table->boolean('is_alive')->default(true); // 1 = Hidup, 0 = Meninggal
            $table->text('biografi')->nullable();
            
            $table->timestamps(); // Otomatis membuat kolom created_at dan updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('family_members');
    }
};