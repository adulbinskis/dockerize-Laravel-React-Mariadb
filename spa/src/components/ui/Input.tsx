import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
    return (
        <div className="flex flex-col mb-2">
            {label && <label className="mb-1 font-medium">{label}</label>}
            <input
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...props}
            />
            {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
        </div>
    );
};

export default Input;
