import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { createFarm, deleteFarm, fetchFarms } from "../../api/farms";
import Drawer from "../../components/ui/Drawer";
import EditFarmForm from "../../components/EditFarmForm";

interface Farm {
    id: number;
    name: string;
    email: string;
    website?: string;
}

const FarmsPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [farms, setFarms] = useState<Farm[]>([]);
    const [page, setPage] = useState(1);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [website, setWebsite] = useState("");

    const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const loadFarms = async () => {
        try {
            const { data } = await fetchFarms(page);
            setFarms(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = async () => {
        try {
            await createFarm({ name, email, website });
            setName(""); setEmail(""); setWebsite("");
            loadFarms();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteFarm(id);
            loadFarms();
        } catch (err) {
            console.error(err);
        }
    };

    const handleGoToAnimals = (id: number) => {
        navigate(`/farms/${id}/animals`);
    };

    const openDrawer = (farmId: number) => {
        setSelectedFarmId(farmId);
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setSelectedFarmId(null);
        setIsDrawerOpen(false);
        loadFarms()
    };

    useEffect(() => {
        loadFarms();
    }, [page]);

    return (
        <div className={'container'}>
            <main className="p-4">
                <h2 className="text-2xl font-bold mb-4">Farms</h2>

                <div className="mb-4 flex gap-2">
                    <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input placeholder="Website" value={website} onChange={(e) => setWebsite(e.target.value)} />
                    <Button variant="primary" onClick={handleCreate} expernalClassname={'mb-2'}>
                        Add Farm
                    </Button>
                </div>

                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Website</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {farms.map((farm) => (
                            <tr key={farm.id} className="hover:bg-gray-100 cursor-pointer">
                                <td className="border p-2">{farm.name}</td>
                                <td className="border p-2">{farm.email}</td>
                                <td className="border p-2">{farm.website}</td>
                                <td className="border p-2 flex gap-2 justify-end">
                                    <Button variant="danger" onClick={() => handleDelete(farm.id)}>
                                        Delete
                                    </Button>
                                    <Button variant={"primary"} onClick={() => handleGoToAnimals(farm.id)}>
                                        View
                                    </Button>
                                    <Button variant={"primary"} onClick={() => openDrawer(farm.id)}>Edit</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex gap-2 mt-4">
                    <Button onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
                    <span>Page {page}</span>
                    <Button onClick={() => setPage((p) => p + 1)}>Next</Button>
                </div>
            </main>
            <Drawer isOpen={isDrawerOpen} onClose={closeDrawer} title="Edit Farm">
                {selectedFarmId ? <EditFarmForm farmId={selectedFarmId} onSuccess={closeDrawer} /> : <></>}
            </Drawer>
        </div>
    );
};

export default FarmsPage;
