import { http } from "./axios";

export interface AnimalData {
    animal_number: string;
    type_name: string;
    years?: number;
}

export interface Animal {
    id: number;
    animal_number: string;
    type_name: string;
    years?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

const fetchAnimals = (farmId: number, page: number = 1): Promise<{ data: PaginatedResponse<Animal> }> => {
    return http.get(`/api/farms/${farmId}/animals?page=${page}`);
};

const getAnimal = (farmId: number, id: number): Promise<{ data: Animal }> => {
    return http.get(`/api/farms/${farmId}/animals/${id}`);
};

const createAnimal = (farmId: number, animal: AnimalData): Promise<{ data: Animal }> => {
    return http.post(`/api/farms/${farmId}/animals`, animal);
};

const updateAnimal = (farmId: number, id: number, animal: AnimalData): Promise<{ data: Animal }> => {
    return http.put(`/api/farms/${farmId}/animals/${id}`, animal);
};

const deleteAnimal = (farmId: number, id: number): Promise<void> => {
    return http.delete(`/api/farms/${farmId}/animals/${id}`);
};

export { fetchAnimals, getAnimal, createAnimal, updateAnimal, deleteAnimal };
