import api from "./axios";

export async function login(email: string, password: string) {
    await api.get("/sanctum/csrf-cookie");
    const { data } = await api.post("/login", { email, password });
    return data;
}

export async function register(name: string, email: string, password: string, password_confirmation: string) {
    await api.get("/sanctum/csrf-cookie");
    const { data } = await api.post("/register", { name, email, password, password_confirmation });
    return data;
}

export async function logout() {
    const { data } = await api.post("/logout");
    return data;
}

export async function getMe() {
    const { data } = await api.get("/me");
    return data;
}