import { http } from "./axios";

export interface FarmData {
    name: string;
    email: string;
    website?: string;
}

export interface Farm {
    id: number;
    name: string;
    email: string;
    website?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

const fetchFarms = (page: number = 1): Promise<{ data: PaginatedResponse<Farm> }> => {
    return http.get(`/api/farms?page=${page}`);
};

const getFarm = (id: number): Promise<{ data: Farm }> => {
    return http.get(`/api/farms/${id}`);
};

const createFarm = (farm: FarmData): Promise<{ data: Farm }> => {
    return http.post("/api/farms", farm);
};

const updateFarm = (id: number, farm: FarmData): Promise<{ data: Farm }> => {
    return http.put(`/api/farms/${id}`, farm);
};

const deleteFarm = (id: number): Promise<void> => {
    return http.delete(`/api/farms/${id}`);
};

export { fetchFarms, getFarm, createFarm, updateFarm, deleteFarm };
