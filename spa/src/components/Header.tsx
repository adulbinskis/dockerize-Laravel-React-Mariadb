import React from "react";
import { http } from "../api/axios";
import { useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import { useAuth } from "../hooks/useAuth";


const Header: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth()

    const handleLogout = async () => {
        try {
            await http.post("/logout");
            logout()
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <header className="bg-gray-800 text-white flex justify-between items-center p-4">
            <h1 className="text-xl font-bold">Hello! {user?.name}</h1>
            <Button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded"
            >
                Logout
            </Button>
        </header>
    );
};

export default Header;
