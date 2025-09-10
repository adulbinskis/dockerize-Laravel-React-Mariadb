import React, { useEffect, useState } from "react";
import { getFarm, updateFarm, FarmData } from "../api/farms";
import Input from "./ui/Input";
import Button from "./ui/Button";

interface EditFarmFormProps {
    farmId: number;
    onSuccess: () => void;
}

const EditFarmForm: React.FC<EditFarmFormProps> = ({ farmId, onSuccess }) => {
    const [farm, setFarm] = useState<FarmData>({ name: "", email: "", website: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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
            await updateFarm(farmId, farm);
            onSuccess();
        } catch (err: any) {
            alert(err.response?.data?.error || "Failed to update farm");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading farm data...</p>;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-2">
            <Input
                type="text"
                placeholder="Farm Name"
                value={farm.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
            />
            <Input
                type="email"
                placeholder="Email"
                value={farm.email}
                onChange={(e) => handleChange("email", e.target.value)}
            />
            <Input
                type="text"
                placeholder="Website"
                value={farm.website}
                onChange={(e) => handleChange("website", e.target.value)}
            />

            <Button type="submit" variant="primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
            </Button>
        </form>
    );
};

export default EditFarmForm;
