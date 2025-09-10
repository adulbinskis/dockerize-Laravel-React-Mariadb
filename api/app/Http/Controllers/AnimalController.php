<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAnimalRequest;
use App\Http\Requests\UpdateAnimalRequest;
use App\Models\Animal;
use App\Models\Farm;
use App\Services\AnimalService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use App\Http\Traits\AuthorizesOwnership;

class AnimalController extends Controller
{
    use AuthorizesOwnership;
    protected AnimalService $animalService;

    public function __construct(AnimalService $animalService)
    {
        $this->animalService = $animalService;
        $this->middleware('auth:sanctum');
    }

    public function index(Farm $farm, Request $request)
    {
        $this->authorizeOwner($farm, $request);

        $animals = $this->animalService->index($farm);
        return response()->json($animals);
    }

    public function store(StoreAnimalRequest $request, Farm $farm)
    {
        $this->authorizeOwner($farm, $request);

        $animal = $this->animalService->store($request->validated(), $farm);
        return response()->json($animal, 201);
    }

    public function show(Farm $farm, Animal $animal, Request $request)
    {
        $this->authorizeOwner($farm, $request);

        $animal = $this->animalService->show($animal->id, $farm);
        if (!$animal) {
            abort(404);
        }

        return response()->json($animal);
    }

    public function update(UpdateAnimalRequest $request, Farm $farm, Animal $animal)
    {
        $this->authorizeOwner($farm, $request);

        $animal = $this->animalService->update($animal, $request->validated());
        return response()->json($animal);
    }

    public function destroy(Farm $farm, Animal $animal, Request $request)
    {
        $this->authorizeOwner($farm, $request);

        $this->animalService->destroy($animal);
        return response()->json(['message' => 'Animal deleted']);
    }

}
