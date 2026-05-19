<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\SilsilahController;

// Endpoint Silsilah Keluarga Besar v1
Route::get('/v1/silsilah', [SilsilahController::class, 'getTree']);
Route::post('/v1/silsilah/import', [SilsilahController::class, 'importExcel']);