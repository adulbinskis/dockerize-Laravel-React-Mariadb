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

    public function index(int $userId, int $perPage = 10)
    {
        return $this->farmRepository->index($userId, $perPage);
    }

    public function getFarm(int $id, int $userId): ?Farm
    {
        return $this->farmRepository->findByIdForUser($id, $userId);
    }

    public function store(array $data, int $userId): Farm
    {
        return $this->farmRepository->createForUser($data, $userId);
    }

    public function update(Farm $farm, array $data): Farm
    {
        return $this->farmRepository->update($data, $farm->id);
    }

    public function destroy(Farm $farm): Farm
    {
        return $this->farmRepository->delete($farm->id);
    }
}
