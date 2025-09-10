import { useAuth } from '../../hooks/useAuth';

export default function Dashboard() {
    const { user } = useAuth()
    return <div className="p-5 text-center text-xl ">{user?.name}</div>;
}
