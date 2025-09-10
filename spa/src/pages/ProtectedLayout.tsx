import { ReactNode } from "react";
import Header from "../components/Header";

interface ProtectedLayoutProps {
    children: ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
    return (
        <div>
            <Header />
            <main className="p-4">{children}</main>
        </div>
    );
};

export default ProtectedLayout;
