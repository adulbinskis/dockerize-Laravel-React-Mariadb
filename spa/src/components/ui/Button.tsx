import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary";
};

const Button: React.FC<ButtonProps> = ({ children, variant = "primary", ...props }) => {
    const base = "px-4 py-2 rounded font-medium transition";
    const styles = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    };

    return (
        <button className={`${base} ${styles[variant]}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
