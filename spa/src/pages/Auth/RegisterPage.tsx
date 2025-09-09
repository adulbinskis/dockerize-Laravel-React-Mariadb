import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, getMe } from "../../api/authService";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";

const RegisterPage: React.FC = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [error, setError] = useState<string | null>(null);

    const { login: setUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await register(name, email, password, passwordConfirmation);
            const user = await getMe();
            setUser(user);
            navigate("/login", { replace: true });
        } catch (err) {
            setError("Registration failed. Please check your input.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-md w-96 space-y-4"
            >
                <h1 className="text-2xl font-bold text-center">Register</h1>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <Input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                />

                <Button type="submit" variant="primary" className="w-full">
                    Register
                </Button>
                <Button type={"submit"} variant="primary" className="w-full" onClick={() => navigate('/login')}>
                    To login
                </Button>
            </form>
        </div>
    );
};

export default RegisterPage;
