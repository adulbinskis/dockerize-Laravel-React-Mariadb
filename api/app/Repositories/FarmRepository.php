<?php

namespace App\Repositories;

use App\Models\Farm;

class FarmRepository extends BaseRepository
{
    public function __construct(Farm $farm)
    {
        parent::__construct($farm);
    }

    public function index(int $userId, int $perPage = 10)
    {
        return $this->model->where('user_id', $userId)->paginate($perPage);
    }

    public function findByIdForUser(int $id, int $userId): ?Farm
    {
        return $this->model->where('id', $id)
            ->where('user_id', $userId)
            ->first();
    }

    public function createForUser(array $data, int $userId): Farm
    {
        $data['user_id'] = $userId;
        return $this->model->create($data);
    }
}
