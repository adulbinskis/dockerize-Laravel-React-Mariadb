<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use App\Http\Requests\UpdateFarmRequest;
use App\Models\Farm;
use App\Services\FarmService;
use Illuminate\Http\Request;

class FarmController extends Controller
{
    protected FarmService $service;

    public function __construct(FarmService $service)
    {
        $this->service = $service;
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        $farms = $this->service->listFarms($request->user()->id);
        return response()->json($farms);
    }

    public function store(UpdateFarmRequest $request)
    {
        $farm = $this->service->createFarm($request->validated(), $request->user()->id);
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
        $this->service->updateFarm($farm, $request->validated());
        return response()->json($farm);
    }

    public function destroy(Farm $farm, Request $request)
    {
        if ($farm->user_id !== $request->user()->id) {
            abort(403);
        }
        $this->service->deleteFarm($farm);
        return response()->json(['message' => 'Farm deleted']);
    }
}
