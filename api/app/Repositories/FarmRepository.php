<?php

namespace App\Repositories;

use App\Models\Farm;

class FarmRepository
{
    protected Farm $model;

    public function __construct(Farm $farm)
    {
        $this->model = $farm;
    }

    public function allByUser(int $userId, int $perPage = 10)
    {
        return $this->model->where('user_id', $userId)->paginate($perPage);
    }

    public function findById(int $id, int $userId): ?Farm
    {
        return $this->model->where('id', $id)->where('user_id', $userId)->first();
    }

    public function create(array $data): Farm
    {
        return $this->model->create($data);
    }

    public function update(Farm $farm, array $data): bool
    {
        return $farm->update($data);
    }

    public function delete(Farm $farm): bool
    {
        return $farm->delete();
    }
}
