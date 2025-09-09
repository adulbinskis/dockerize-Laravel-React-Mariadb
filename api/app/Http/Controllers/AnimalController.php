<?php

namespace App\Http\Controllers\Api;


use App\Http\Requests\UpdateAnimalRequest;
use App\Models\Animal;
use App\Models\Farm;
use App\Services\AnimalService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class AnimalController extends Controller
{
    protected AnimalService $service;

    public function __construct(AnimalService $service)
    {
        $this->service = $service;
        $this->middleware('auth:sanctum');
    }

    public function index(Farm $farm, Request $request)
    {
        if ($farm->user_id !== $request->user()->id) {
            abort(403);
        }

        $animals = $this->service->listAnimals($farm);
        return response()->json($animals);
    }

    public function store(UpdateAnimalRequest $request, Farm $farm)
    {
        if ($farm->user_id !== $request->user()->id) {
            abort(403);
        }

        try {
            $animal = $this->service->createAnimal($request->validated(), $farm);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

        return response()->json($animal, 201);
    }

    public function show(Farm $farm, Animal $animal, Request $request)
    {
        if ($farm->user_id !== $request->user()->id) {
            abort(403);
        }

        $animal = $this->service->getAnimal($animal->id, $farm);

        if (!$animal) {
            abort(404);
        }

        return response()->json($animal);
    }

    public function update(UpdateAnimalRequest $request, Farm $farm, Animal $animal)
    {
        if ($farm->user_id !== $request->user()->id) {
            abort(403);
        }

        $this->service->updateAnimal($animal, $request->validated());
        return response()->json($animal);
    }

    public function destroy(Farm $farm, Animal $animal, Request $request)
    {
        if ($farm->user_id !== $request->user()->id) {
            abort(403);
        }

        $this->service->deleteAnimal($animal);
        return response()->json(['message' => 'Animal deleted']);
    }
}
