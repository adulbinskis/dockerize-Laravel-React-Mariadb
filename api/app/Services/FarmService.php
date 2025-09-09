<?php

namespace App\Services;

use App\Models\Farm;
use App\Repositories\FarmRepository;

class FarmService
{
    protected FarmRepository $repo;

    public function __construct(FarmRepository $repo)
    {
        $this->repo = $repo;
    }

    public function listFarms(int $userId, int $perPage = 10)
    {
        return $this->repo->allByUser($userId, $perPage);
    }

    public function getFarm(int $id, int $userId): ?Farm
    {
        return $this->repo->findById($id, $userId);
    }

    public function createFarm(array $data, int $userId): Farm
    {
        $data['user_id'] = $userId;
        return $this->repo->create($data);
    }

    public function updateFarm(Farm $farm, array $data): bool
    {
        return $this->repo->update($farm, $data);
    }

    public function deleteFarm(Farm $farm): bool
    {
        return $this->repo->delete($farm);
    }
}
