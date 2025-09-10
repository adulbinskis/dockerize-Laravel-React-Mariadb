import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger";
    children: React.ReactNode;
    expernalClassname?: string
}

const Button: React.FC<ButtonProps> = ({ expernalClassname, variant = "primary", children, ...props }) => {
    let baseClasses = `px-3 py-1 rounded font-semibold ${expernalClassname}`;
    let colorClasses = "";

    switch (variant) {
        case "primary":
            colorClasses = "bg-blue-500 hover:bg-blue-600 text-white";
            break;
        case "secondary":
            colorClasses = "bg-gray-500 hover:bg-gray-600 text-white";
            break;
        case "danger":
            colorClasses = "bg-red-500 hover:bg-red-600 text-white";
            break;
    }

    return (
        <button className={`${baseClasses} ${colorClasses}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
