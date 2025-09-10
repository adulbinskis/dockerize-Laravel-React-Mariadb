<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller;
use App\Http\Requests\UpdateFarmRequest;
use App\Models\Farm;
use App\Services\FarmService;
use Illuminate\Http\Request;

class FarmController extends Controller
{
    protected FarmService $farmService;

    public function __construct(FarmService $farmService)
    {
        $this->farmService = $farmService;
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        $farms = $this->farmService->listFarms($request->user()->id);
        return response()->json($farms);
    }

    public function store(UpdateFarmRequest $request)
    {
        $farm = $this->farmService->createFarm($request->validated(), $request->user()->id);
        return response()->json($farm, 201);
    }

    public function show(Farm $farm, Request $request)
    {
        if ($farm->user_id !== $request->user()->id) {
            abort(403);
        }
        return response()->json($farm);
    }

    public function update(UpdateFarmRequest $request, Farm $farm)
    {
        if ($farm->user_id !== $request->user()->id) {
            abort(403);
        }
        $this->farmService->updateFarm($farm, $request->validated());
        return response()->json($farm);
    }

    public function destroy(Farm $farm, Request $request)
    {
        if ($farm->user_id !== $request->user()->id) {
            abort(403);
        }
        $this->farmService->deleteFarm($farm);
        return response()->json(['message' => 'Farm deleted']);
    }
}
