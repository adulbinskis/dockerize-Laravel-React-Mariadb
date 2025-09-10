import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { fetchAnimals, createAnimal, deleteAnimal, Animal } from "../../api/animals";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Drawer from "../../components/ui/Drawer";
import EditAnimalForm from "../../components/EditAnimalForm";

const AnimalsPage: React.FC = () => {
    const { farmId } = useParams<{ farmId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate()

    const [animals, setAnimals] = useState<Animal[]>([]);
    const [page, setPage] = useState(1);

    const [animalNumber, setAnimalNumber] = useState<number>(1);
    const [typeName, setTypeName] = useState("");
    const [years, setYears] = useState<number | undefined>();

    const [selectedAnimalId, setSelectedAnimalId] = useState<number | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const loadAnimals = async () => {
        if (!farmId) return;
        try {
            const { data } = await fetchAnimals(Number(farmId), page);
            setAnimals(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = async () => {
        if (!farmId) return;
        try {
            await createAnimal(Number(farmId), { animal_number: animalNumber, type_name: typeName, years });
            setAnimalNumber(1); setTypeName(""); setYears(undefined);
            loadAnimals();
        } catch (err: any) {
            alert(err.response?.data?.error || "Failed to add animal");
        }
    };

    const handleDelete = async (id: number) => {
        if (!farmId) return;
        try {
            await deleteAnimal(Number(farmId), id);
            loadAnimals();
        } catch (err) {
            console.error(err);
        }
    };

    const openDrawer = (animalId: number) => {
        setSelectedAnimalId(animalId);
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setSelectedAnimalId(null);
        setIsDrawerOpen(false);
        loadAnimals()
    };

    useEffect(() => {
        loadAnimals();
    }, [page, farmId]);

    return (
        <div className={'container'}>
            <main className="p-4">
                <div className="mb-4">
                    <Button variant="secondary" onClick={() => navigate("/")}>
                        ← Back to Farms
                    </Button>
                </div>
                <h2 className="text-2xl font-bold mb-4">Animals of Farm {farmId}</h2>

                <div className="mb-4 flex gap-2">
                    <Input
                        type="number"
                        min={1}
                        placeholder="Number"
                        value={animalNumber}
                        onChange={(e) => setAnimalNumber(Number(e.target.value))}
                    />
                    <Input
                        type="text"
                        placeholder="Type"
                        value={typeName}
                        onChange={(e) => setTypeName(e.target.value)}
                    />
                    <Input
                        type="number"
                        min={0}
                        placeholder="Years"
                        value={years ?? ""}
                        onChange={(e) => setYears(Number(e.target.value))}
                    />
                    <Button variant="primary" onClick={handleCreate} expernalClassname={'mb-2'}>
                        Add Animal
                    </Button>
                </div>

                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Number</th>
                            <th className="border p-2">Type</th>
                            <th className="border p-2">Years</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {animals.map((animal) => (
                            <tr key={animal.id}>
                                <td className="border p-2">{animal.animal_number}</td>
                                <td className="border p-2">{animal.type_name}</td>
                                <td className="border p-2">{animal.years ?? "-"}</td>
                                <td className="border p-2 flex gap-2 justify-end">
                                    <Button variant="danger" onClick={() => handleDelete(animal.id)}>
                                        Delete
                                    </Button>
                                    <Button variant={"primary"} onClick={() => openDrawer(animal.id)}>Edit</Button>
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
                {(selectedAnimalId && farmId) ? <EditAnimalForm farmId={Number(farmId)} animalId={selectedAnimalId} onSuccess={closeDrawer} /> : <></>}
            </Drawer>
        </div>
    );
};

export default AnimalsPage;
