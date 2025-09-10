import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAnimals, createAnimal, deleteAnimal, Animal } from "../../api/animals";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Drawer from "../../components/ui/Drawer";
import EditAnimalForm from "../../components/EditAnimalForm";
import * as Yup from "yup";

const animalSchema = Yup.object().shape({
    animalNumber: Yup.string()
        .required("Type is required"),
    typeName: Yup.string()
        .required("Type is required"),
    years: Yup.number()
        .min(0, "Years cannot be negative")
        .nullable()
        .notRequired(),
});

const AnimalsPage: React.FC = () => {
    const { farmId } = useParams<{ farmId: string }>();
    const navigate = useNavigate();

    const [animals, setAnimals] = useState<Animal[]>([]);
    const [page, setPage] = useState(1);

    const [animalNumber, setAnimalNumber] = useState<string>('');
    const [typeName, setTypeName] = useState('');
    const [years, setYears] = useState<number | undefined>();

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
        if (animals.length >= 3) {
            alert('Saimniecībai varbūt ne vairāk par 3 dzīvinekiem')
            return
        }

        try {
            await animalSchema.validate(
                { animalNumber, typeName, years },
                { abortEarly: false }
            );

            await createAnimal(Number(farmId), {
                animal_number: animalNumber,
                type_name: typeName,
                years,
            });

            setAnimalNumber('');
            setTypeName('');
            setYears(undefined);
            setErrors({});
            loadAnimals();
        } catch (err: any) {
            if (err.name === "ValidationError") {
                const newErrors: { [key: string]: string } = {};
                err.inner.forEach((e: any) => {
                    if (e.path) newErrors[e.path] = e.message;
                });
                setErrors(newErrors);
            } else {
                alert(err.response?.data?.error || "Failed to add animal");
            }
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
        loadAnimals();
    };

    useEffect(() => {
        loadAnimals();
    }, [page, farmId]);

    return (
        <div className="container">
            <main className="p-4">
                <div className="mb-4">
                    <Button variant="secondary" onClick={() => navigate("/")}>
                        ← Back to Farms
                    </Button>
                </div>
                <h2 className="text-2xl font-bold mb-4">
                    Animals of Farm {farmId}
                </h2>

                <div className="mb-4 flex flex-col gap-2 md:flex-row">
                    <div className="flex flex-col">
                        <Input
                            type="text"
                            min={1}
                            placeholder="Number"
                            value={animalNumber}
                            onChange={(e) =>
                                setAnimalNumber(e.target.value)
                            }
                        />
                        {errors.animalNumber && (
                            <span className="text-red-500 text-sm">
                                {errors.animalNumber}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <Input
                            type="text"
                            placeholder="Type"
                            value={typeName}
                            onChange={(e) => setTypeName(e.target.value)}
                        />
                        {errors.typeName && (
                            <span className="text-red-500 text-sm">
                                {errors.typeName}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <Input
                            type="number"
                            min={0}
                            placeholder="Years"
                            value={years ?? ""}
                            onChange={(e) => {
                                const val = e.target.value;
                                setYears(val === "" ? undefined : Number(val));
                            }}
                        />
                        {errors.years && (
                            <span className="text-red-500 text-sm">
                                {errors.years}
                            </span>
                        )}
                    </div>

                    <Button
                        variant="primary"
                        onClick={handleCreate}
                        expernalClassname={"h-[42px]"}
                    >
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
                                <td className="border p-2">
                                    {animal.animal_number}
                                </td>
                                <td className="border p-2">
                                    {animal.type_name}
                                </td>
                                <td className="border p-2">
                                    {animal.years ?? "-"}
                                </td>
                                <td className="border p-2 flex gap-2 justify-end">
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDelete(animal.id)}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant={"primary"}
                                        onClick={() => openDrawer(animal.id)}
                                    >
                                        Edit
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex gap-2 mt-4">
                    <Button onClick={() => setPage((p) => Math.max(1, p - 1))}>
                        Prev
                    </Button>
                    <span>Page {page}</span>
                    <Button onClick={() => setPage((p) => p + 1)}>Next</Button>
                </div>
            </main>
            <Drawer
                isOpen={isDrawerOpen}
                onClose={closeDrawer}
                title="Edit Animal"
            >
                {selectedAnimalId && farmId ? (
                    <EditAnimalForm
                        farmId={Number(farmId)}
                        animalId={selectedAnimalId}
                        onSuccess={closeDrawer}
                    />
                ) : (
                    <></>
                )}
            </Drawer>
        </div>
    );
};

export default AnimalsPage;
