"use client";

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Ambassador {
    id: string;
    name: string;
    college: string;
    referralCode: string;
    referralCount: number;
}

export default function CaList({ ambassadors }: { ambassadors: Ambassador[] }) {

    const downloadCSV = () => {
        if (!ambassadors.length) return;

        const headers = ["Name", "College", "Referral Code", "Referral Count"];
        const rows = ambassadors.map(a => [
            a.name,
            a.college,
            a.referralCode,
            a.referralCount
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "campus_ambassadors.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Ambassador List</CardTitle>
                <Button variant="outline" size="sm" onClick={downloadCSV}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                </Button>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border border-slate-200 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>College</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead className="text-right">Referrals</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ambassadors.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        No ambassadors found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                ambassadors.map((a) => (
                                    <TableRow key={a.id}>
                                        <TableCell className="font-medium">{a.name}</TableCell>
                                        <TableCell>{a.college}</TableCell>
                                        <TableCell className="font-mono text-xs">{a.referralCode}</TableCell>
                                        <TableCell className="text-right font-bold">{a.referralCount}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
