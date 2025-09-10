<?php

namespace App\Repositories;

use App\Models\Animal;
use App\Models\Farm;

class AnimalRepository extends BaseRepository
{
    public function __construct(Animal $animal)
    {
        parent::__construct($animal);
    }

    public function index(Farm $farm, int $perPage = 10)
    {
        return $farm->animals()->paginate($perPage);
    }

    public function findByIdForFarm(int $id, Farm $farm): ?Animal
    {
        return $farm->animals()->where('id', $id)->first();
    }

    public function createForFarm(array $data, Farm $farm): Animal
    {
        $data['farm_id'] = $farm->id;
        return parent::create($data);
    }
}
