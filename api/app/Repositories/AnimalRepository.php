<?php

namespace App\Repositories;

use App\Models\Animal;
use App\Models\Farm;

class AnimalRepository
{
    protected Animal $model;

    public function __construct(Animal $animal)
    {
        $this->model = $animal;
    }

    public function allByFarm(Farm $farm, int $perPage = 10)
    {
        return $farm->animals()->paginate($perPage);
    }

    public function findById(int $id, Farm $farm): ?Animal
    {
        return $farm->animals()->where('id', $id)->first();
    }

    public function create(array $data): Animal
    {
        return $this->model->create($data);
    }

    public function update(Animal $animal, array $data): bool
    {
        return $animal->update($data);
    }

    public function delete(Animal $animal): bool
    {
        return $animal->delete();
    }
}
