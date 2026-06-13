<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FamilyMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'gender', 'father_id', 'mother_id', 'spouse_id', 'is_alive', 'biografi'
    ];

    // Relasi untuk mendapatkan Ayah
    public function father()
    {
        return $this->belongsTo(FamilyMember::class, 'father_id');
    }

    // Relasi untuk mendapatkan Ibu
    public function mother()
    {
        return $this->belongsTo(FamilyMember::class, 'mother_id');
    }

    // Relasi untuk mendapatkan pasangan
    public function spouse(): BelongsTo
    {
        return $this->belongsTo(FamilyMember::class, 'spouse_id');
    }

    // Relasi untuk mendapatkan Anak-anak (di mana member ini adalah ayah ATAU ibu)
    public function children()
    {
        return FamilyMember::where('father_id', $this->id)
                           ->orWhere('mother_id', $this->id)
                           ->get();
    }
}