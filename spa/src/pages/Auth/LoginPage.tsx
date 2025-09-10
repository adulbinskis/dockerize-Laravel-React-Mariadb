import React, { useState } from "react";
import { login } from "../../api/authService";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await login(email, password);
            console.log("Logged in!", res);
            navigate('/', { replace: true });
        } catch (err) {
            console.error("Login failed", err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96 space-y-4">
                <h1 className="text-2xl font-bold text-center">Login</h1>
                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button type="submit" variant="primary" className="w-full">
                    Login
                </Button>
                <Button variant="primary" className="w-full" onClick={() => navigate('/register')}>
                    To register
                </Button>
            </form>
        </div>
    );
};

export default LoginPage;
