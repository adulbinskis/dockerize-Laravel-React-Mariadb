import React, { useEffect, useState } from "react";
import { getFarm, updateFarm, FarmData } from "../api/farms";
import Input from "./ui/Input";
import Button from "./ui/Button";
import * as Yup from "yup";

interface EditFarmFormProps {
    farmId: number;
    onSuccess: () => void;
}

const farmSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),
    website: Yup.string()
        .url("Must be a valid URL")
        .nullable()
        .notRequired(),
});

const EditFarmForm: React.FC<EditFarmFormProps> = ({ farmId, onSuccess }) => {
    const [farm, setFarm] = useState<FarmData>({
        name: "",
        email: "",
        website: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const loadFarm = async () => {
            try {
                const { data } = await getFarm(farmId);
                setFarm({
                    name: data.name,
                    email: data.email || "",
                    website: data.website || "",
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadFarm();
    }, [farmId]);

    const handleChange = (field: keyof FarmData, value: string) => {
        setFarm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await farmSchema.validate(farm, { abortEarly: false });

            await updateFarm(farmId, farm);
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
                alert(err.response?.data?.error || "Failed to update farm");
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading farm data...</p>;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-2">
            <div className="flex flex-col">
                <Input
                    type="text"
                    placeholder="Farm Name"
                    value={farm.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                />
                {errors.name && (
                    <span className="text-red-500 text-sm">{errors.name}</span>
                )}
            </div>

            <div className="flex flex-col">
                <Input
                    type="email"
                    placeholder="Email"
                    value={farm.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                />
                {errors.email && (
                    <span className="text-red-500 text-sm">{errors.email}</span>
                )}
            </div>

            <div className="flex flex-col">
                <Input
                    type="text"
                    placeholder="Website"
                    value={farm.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                />
                {errors.website && (
                    <span className="text-red-500 text-sm">{errors.website}</span>
                )}
            </div>

            <Button type="submit" variant="primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
            </Button>
        </form>
    );
};

export default EditFarmForm;
