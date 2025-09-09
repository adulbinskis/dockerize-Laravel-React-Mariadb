<?php

namespace App\Services;

use App\Models\Animal;
use App\Models\Farm;
use App\Repositories\AnimalRepository;

class AnimalService
{
    protected AnimalRepository $repo;

    public function __construct(AnimalRepository $repo)
    {
        $this->repo = $repo;
    }

    public function listAnimals(Farm $farm, int $perPage = 10)
    {
        return $this->repo->allByFarm($farm, $perPage);
    }

    public function getAnimal(int $id, Farm $farm): ?Animal
    {
        return $this->repo->findById($id, $farm);
    }

    public function createAnimal(array $data, Farm $farm): Animal
    {
        if ($farm->animals()->count() >= 3) {
            throw new \Exception("Each farm can have max 3 animals");
        }

        $data['farm_id'] = $farm->id;
        return $this->repo->create($data);
    }

    public function updateAnimal(Animal $animal, array $data): bool
    {
        return $this->repo->update($animal, $data);
    }

    public function deleteAnimal(Animal $animal): bool
    {
        return $this->repo->delete($animal);
    }
}
