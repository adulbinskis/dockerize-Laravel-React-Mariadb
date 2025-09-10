import React from "react";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import FarmsPage from "../pages/FarmsPage/FarmsPage";
import AnimalsPage from "../pages/AnimalsPage/AnimalsPage";


interface AppRoute {
    path: string;
    element: React.FC<{}>;
    protected?: boolean;
}

export const routes: AppRoute[] = [
    { path: "/login", element: LoginPage },
    { path: "/register", element: RegisterPage },
    { path: "/", element: FarmsPage, protected: true },
    { path: "/farms/:farmId/animals", element: AnimalsPage, protected: true },
];
