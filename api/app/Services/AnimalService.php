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

    public function listAnimals(Farm $farm, int $perPage = 10)
    {
        return $this->animalRepository->allByFarm($farm, $perPage);
    }

    public function getAnimal(int $id, Farm $farm): ?Animal
    {
        return $this->animalRepository->findById($id, $farm);
    }

    public function createAnimal(array $data, Farm $farm): Animal
    {
        if ($farm->animals()->count() >= 3) {
            throw new \Exception("Each farm can have max 3 animals");
        }

        $data['farm_id'] = $farm->id;
        return $this->animalRepository->create($data);
    }

    public function updateAnimal(Animal $animal, array $data): bool
    {
        return $this->animalRepository->update($animal, $data);
    }

    public function deleteAnimal(Animal $animal): bool
    {
        return $this->animalRepository->delete($animal);
    }
}
