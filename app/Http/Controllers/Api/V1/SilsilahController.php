<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\SilsilahService;
use Illuminate\Http\JsonResponse;

class SilsilahController extends Controller
{
    protected $silsilahService;

    // Dependency Injection: Masukkan Service ke dalam Controller
    public function __construct(SilsilahService $silsilahService)
    {
        $this->silsilahService = $silsilahService;
    }

    /**
     * Endpoint API Silsilah Tree
     */
    public function getTree(): JsonResponse
    {
        // Controller hanya meminta hasil matang dari Service
        $treeData = $this->silsilahService->buildKeluargaTree();

        return response()->json([
            'success' => true,
            'message' => 'Data silsilah berhasil ditarik (Repository-Service Pattern).',
            'data' => $treeData
        ], 200);
    }
}