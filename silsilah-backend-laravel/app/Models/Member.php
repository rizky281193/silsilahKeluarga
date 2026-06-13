<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Member extends Model
{
    use HasFactory;

    // Proteksi kolom yang boleh diisi secara massal (Mass Assignment)
    protected $fillable = [
        'name',
        'gender',
        'father_id',
        'mother_id',
        'spouse_id',
        'birth_date',
        'is_alive',
        'meta_data'
    ];

    // Cast kolom meta_data otomatis dari JSON teks menjadi Array PHP saat diakses
    protected $casts = [
        'meta_data' => 'array',
        'is_alive' => 'boolean',
        'birth_date' => 'date',
    ];

    /**
     * Relasi ke Ayah (Self-Referencing BelongsTo)
     */
    public function father(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'father_id');
    }

    /**
     * Relasi ke Ibu (Self-Referencing BelongsTo)
     */
    public function mother(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'mother_id');
    }

    /**
     * Relasi ke Pasangan / Suami-Istri (Self-Referencing BelongsTo)
     */
    public function spouse(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'spouse_id');
    }

    /**
     * Mendapatkan daftar anak jika subjek adalah Ayah
     */
    public function childrenFromFather(): HasMany
    {
        return $this->hasMany(Member::class, 'father_id');
    }

    /**
     * Mendapatkan daftar anak jika subjek adalah Ibu
     */
    public function childrenFromMother(): HasMany
    {
        return $this->hasMany(Member::class, 'mother_id');
    }
}