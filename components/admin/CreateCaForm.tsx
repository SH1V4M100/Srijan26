"use client";

import { useState } from "react";
import { createCampusAmbassador } from "@/services/CaService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";

export default function CreateCaForm() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        name: "",
        college: "",
        referralCode: ""
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!data.name || !data.college || !data.referralCode) {
            toast.error("All fields are required");
            return;
        }

        setLoading(true);
        const res = await createCampusAmbassador(data);
        setLoading(false);

        if (res.ok) {
            toast.success(res.message);
            setData({ name: "", college: "", referralCode: "" });
        } else {
            toast.error(res.message);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Ambassador</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                            placeholder="Full Name w/o Dr."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">College</label>
                        <Input
                            value={data.college}
                            onChange={(e) => setData({ ...data, college: e.target.value })}
                            placeholder="College Name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Referral Code</label>
                        <Input
                            value={data.referralCode}
                            onChange={(e) => setData({ ...data, referralCode: e.target.value })}
                            placeholder="Unique Code (e.g. SRIJAN26-JU)"
                        />
                    </div>
                    <Button type="submit" className="w-full bg-slate-900 text-white" disabled={loading}>
                        {loading ? "Creating..." : "Create Ambassador"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
