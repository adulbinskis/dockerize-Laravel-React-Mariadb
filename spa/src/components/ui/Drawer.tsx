import React, { ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";
import Button from "./Button";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [onClose]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex">
            <div
                className="absolute inset-0 bg-black bg-opacity-50 animate-fadeIn"
                onClick={onClose}
            />

            <div className="relative ml-auto w-96 max-w-full bg-white h-full shadow-xl p-4 flex flex-col animate-slideIn">
                <div className="flex justify-between items-center mb-4">
                    {title && <h2 className="text-xl font-bold">{title}</h2>}
                    <Button variant="secondary" onClick={onClose}>
                        ✕
                    </Button>
                </div>

                <div className="flex-1 overflow-auto">{children}</div>
            </div>
        </div>,
        document.body
    );
};

export default Drawer;
