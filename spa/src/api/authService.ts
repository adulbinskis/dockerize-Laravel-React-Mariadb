import { http } from "./axios";

export async function login(email: string, password: string) {
    await http.get('/sanctum/csrf-cookie');
    const { data } = await http.post('/login', { email, password });
    return data;
}

export async function register(name: string, email: string, password: string, password_confirmation: string) {
    await http.get("/sanctum/csrf-cookie");
    const { data } = await http.post("/register", { name, email, password, password_confirmation });
    return data;
}

export async function logout() {
    const { data } = await http.post("/logout");
    return data;
}

export async function getMe() {
    const { data } = await http.get("/me");
    return data;
}