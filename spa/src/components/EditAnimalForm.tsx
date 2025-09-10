import React, { useEffect, useState } from "react";
import { getAnimal, updateAnimal, AnimalData } from "../api/animals";
import Input from "./ui/Input";
import Button from "./ui/Button";
import * as Yup from "yup";

interface EditAnimalFormProps {
    farmId: number;
    animalId: number;
    onSuccess: () => void;
}

// ✅ Yup schema
const animalSchema = Yup.object().shape({
    animal_number: Yup.number()
        .required("Animal number is required")
        .positive("Must be greater than 0")
        .integer("Must be an integer"),
    type_name: Yup.string().required("Type is required"),
    years: Yup.number()
        .min(0, "Years cannot be negative")
        .nullable()
        .notRequired(),
});

const EditAnimalForm: React.FC<EditAnimalFormProps> = ({
    farmId,
    animalId,
    onSuccess,
}) => {
    const [animal, setAnimal] = useState<AnimalData>({
        animal_number: 1,
        type_name: "",
        years: undefined,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

    const handleChange = (field: keyof AnimalData, value: undefined | number) => {
        setAnimal((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // ✅ validate before updating
            await animalSchema.validate(animal, { abortEarly: false });

            await updateAnimal(farmId, animalId, animal);
            setErrors({});
            onSuccess();
        } catch (err: any) {
            if (err.name === "ValidationError") {
                const newErrors: { [key: string]: string } = {};
                err.inner.forEach((e: any) => {
                    if (e.path) newErrors[e.path] = e.message;
                });
                setErrors(newErrors);
            } else {
                alert(err.response?.data?.error || "Failed to update animal");
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading animal data...</p>;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col">
                <Input
                    type="number"
                    placeholder="Animal Number"
                    value={animal.animal_number}
                    onChange={(e) =>
                        handleChange("animal_number", Number(e.target.value))
                    }
                />
                {errors.animal_number && (
                    <span className="text-red-500 text-sm">
                        {errors.animal_number}
                    </span>
                )}
            </div>

            <div className="flex flex-col">
                <Input
                    type="text"
                    placeholder="Type"
                    value={animal.type_name}
                    onChange={(e) => handleChange("type_name", Number(e.target.value))}
                />
                {errors.type_name && (
                    <span className="text-red-500 text-sm">
                        {errors.type_name}
                    </span>
                )}
            </div>

            <div className="flex flex-col">
                <Input
                    type="number"
                    placeholder="Years"
                    value={animal.years ?? ""}
                    onChange={(e) => {
                        const val = e.target.value;
                        handleChange("years", val === "" ? undefined : Number(val));
                    }}
                />
                {errors.years && (
                    <span className="text-red-500 text-sm">{errors.years}</span>
                )}
            </div>

            <Button type="submit" variant="primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
            </Button>
        </form>
    );
};

export default EditAnimalForm;
