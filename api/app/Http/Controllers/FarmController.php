<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller;
use App\Http\Requests\UpdateFarmRequest;
use App\Models\Farm;
use App\Services\FarmService;
use Illuminate\Http\Request;
use App\Http\Traits\AuthorizesOwnership;

class FarmController extends Controller
{
    use AuthorizesOwnership;
    protected FarmService $farmService;

    public function __construct(FarmService $farmService)
    {
        $this->farmService = $farmService;
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        $farms = $this->farmService->index($request->user()->id);
        return response()->json($farms);
    }

    public function show(Farm $farm, Request $request)
    {
        $this->authorizeOwner($farm, $request);
        return response()->json($farm);
    }

    public function store(UpdateFarmRequest $request)
    {
        $farm = $this->farmService->store($request->validated(), $request->user()->id);
        return response()->json($farm, 201);
    }

    public function update(UpdateFarmRequest $request, Farm $farm)
    {
        $this->authorizeOwner($farm, $request);

        $this->farmService->update($farm, $request->validated());
        return response()->json($farm);
    }

    public function destroy(Farm $farm, Request $request)
    {
        $this->authorizeOwner($farm, $request);

        $this->farmService->destroy($farm);
        return response()->json(['message' => 'Farm deleted']);
    }
}
