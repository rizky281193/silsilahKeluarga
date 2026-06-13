<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\SilsilahService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

    public function importExcel(Request $request): JsonResponse
    {
        // Validasi input: File wajib ada dan harus berformat xlsx / xls
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:10240', // maksimal 10MB
        ]);

        $result = $this->silsilahService->importSilsilahExcel($request->file('file'));

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message']
            ], 422); // HTTP 422 Unprocessable Entity jika logika silsilah melanggar hukum
        }

        return response()->json([
            'success' => true,
            'message' => $result['message']
        ], 200);
    }
}
