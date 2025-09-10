import React, { useEffect, useState } from "react";
import { getAnimal, updateAnimal, AnimalData } from "../api/animals";
import Input from "./ui/Input";
import Button from "./ui/Button";

interface EditAnimalFormProps {
    farmId: number;
    animalId: number;
    onSuccess: () => void;
}

const EditAnimalForm: React.FC<EditAnimalFormProps> = ({ farmId, animalId, onSuccess }) => {
    const [animal, setAnimal] = useState<AnimalData>({
        animal_number: 1,
        type_name: "",
        years: undefined,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadAnimal = async () => {
            try {
                const { data } = await getAnimal(farmId, animalId);
                setAnimal({
                    animal_number: data.animal_number,
                    type_name: data.type_name,
                    years: data.years,
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadAnimal();
    }, [farmId, animalId]);

    const handleChange = (field: keyof AnimalData, value: string | number) => {
        setAnimal((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateAnimal(farmId, animalId, animal);
            onSuccess();
        } catch (err: any) {
            alert(err.response?.data?.error || "Failed to update animal");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading animal data...</p>;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
                type="number"
                placeholder="Animal Number"
                value={animal.animal_number}
                onChange={(e) => handleChange("animal_number", Number(e.target.value))}
                required
            />
            <Input
                type="text"
                placeholder="Type"
                value={animal.type_name}
                onChange={(e) => handleChange("type_name", e.target.value)}
                required
            />
            <Input
                type="number"
                placeholder="Years"
                value={animal.years ?? ""}
                onChange={(e) => handleChange("years", Number(e.target.value))}
            />

            <Button type="submit" variant="primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
            </Button>
        </form>
    );
};

export default EditAnimalForm;
