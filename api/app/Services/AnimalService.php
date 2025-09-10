<?php

namespace App\Services;

use App\Models\Animal;
use App\Models\Farm;
use App\Repositories\AnimalRepository;

class AnimalService
{
    protected AnimalRepository $animalRepository;

    public function __construct(AnimalRepository $animalRepository)
    {
        $this->animalRepository = $animalRepository;
    }

    public function index(Farm $farm, int $perPage = 10)
    {
        return $this->animalRepository->index($farm, $perPage);
    }

    public function show(int $id, Farm $farm): ?Animal
    {
        return $this->animalRepository->findByIdForFarm($id, $farm);
    }

    public function store(array $data, Farm $farm): Animal
    {
        return $this->animalRepository->createForFarm($data, $farm);
    }

    public function update(Animal $animal, array $data): Animal
    {
        return $this->animalRepository->update($data, $animal->id);
    }

    public function destroy(Animal $animal): Animal
    {
        return $this->animalRepository->delete($animal->id);
    }
}
