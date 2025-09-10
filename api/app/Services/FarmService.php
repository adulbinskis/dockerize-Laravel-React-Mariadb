<?php

namespace App\Services;

use App\Models\Farm;
use App\Repositories\FarmRepository;

class FarmService
{
    protected FarmRepository $farmRepository;

    public function __construct(FarmRepository $farmRepository)
    {
        $this->farmRepository = $farmRepository;
    }

    public function listFarms(int $userId, int $perPage = 10)
    {
        return $this->farmRepository->allByUser($userId, $perPage);
    }

    public function getFarm(int $id, int $userId): ?Farm
    {
        return $this->farmRepository->findById($id, $userId);
    }

    public function createFarm(array $data, int $userId): Farm
    {
        $data['user_id'] = $userId;
        return $this->farmRepository->create($data);
    }

    public function updateFarm(Farm $farm, array $data): bool
    {
        return $this->farmRepository->update($farm, $data);
    }

    public function deleteFarm(Farm $farm): bool
    {
        return $this->farmRepository->delete($farm);
    }
}
