"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, Users, CheckCircle2, XCircle, Trash2, Radio } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { AuthUser } from "@/services/AuthService";
import mockEvents from "@/data/eventsMock.json";

// Define local types to avoid dependency on @prisma/client which might not be generated
type Campus = "JADAVPUR" | "SALT_LAKE";
type MerchandiseColor = "BLACK" | "WHITE";

interface SuperAdminDashboardProps {
    user: AuthUser;
}

interface UserData {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    college: string | null;
    department: string | null;
    year: string | null;
    role: string;
    emailVerified: Date | null;
    createdAt: Date;
}

interface MerchandiseData {
    id: string;
    size: string | null;
    color: MerchandiseColor | null;
    status: string | null;
    preferredCampus: Campus;
    customText: string | null;
    user: {
        name: string;
        email: string;
        phone: string | null;
        department: string | null;
        year: string | null;
    };
}

interface LiveEvent {
    id: string;
    slug: string;
    name: string;
    round: string;
    location: string;
}

export function SuperAdminDashboard({ user }: SuperAdminDashboardProps) {
    const [users, setUsers] = useState<UserData[]>([]);
    const [merchandise, setMerchandise] = useState<MerchandiseData[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingMerch, setLoadingMerch] = useState(false);

    // Live Events State
    const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
    const [loadingLiveEvents, setLoadingLiveEvents] = useState(false);
    const [newEventSlug, setNewEventSlug] = useState("");
    const [newEventRound, setNewEventRound] = useState("");
    const [newEventLocation, setNewEventLocation] = useState("");
    const [editingEventId, setEditingEventId] = useState<string | null>(null);

    // Filters
    const [yearFilterValue, setYearFilterValue] = useState<string>("");
    const [yearFilterOperator, setYearFilterOperator] = useState<"gt" | "lt">("gt");
    const [merchCampusFilter, setMerchCampusFilter] = useState<string>("all");
    const [merchColorFilter, setMerchColorFilter] = useState<string>("BLACK");

    useEffect(() => {
        fetchUsers();
        fetchMerchandise();
        fetchLiveEvents();
    }, []);

    async function fetchUsers() {
        setLoadingUsers(true);
        try {
            const res = await fetch("/api/superadmin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoadingUsers(false);
        }
    }

    async function fetchMerchandise() {
        setLoadingMerch(true);
        try {
            const res = await fetch("/api/superadmin/merchandise");
            if (res.ok) {
                const data = await res.json();
                setMerchandise(data);
            }
        } catch (error) {
            console.error("Failed to fetch merchandise", error);
        } finally {
            setLoadingMerch(false);
        }
    }

    async function fetchLiveEvents() {
        setLoadingLiveEvents(true);
        try {
            const res = await fetch("/api/live-events");
            if (res.ok) {
                const data = await res.json();
                setLiveEvents(data);
            }
        } catch (error) {
            console.error("Failed to fetch live events", error);
        } finally {
            setLoadingLiveEvents(false);
        }
    }

    async function handleLiveEventSubmit() {
        if (!newEventSlug || !newEventRound || !newEventLocation) return;
        const selectedEvent = mockEvents.find(e => e.slug === newEventSlug);
        if (!selectedEvent) return;

        if (editingEventId) {
            await updateLiveEvent(selectedEvent.name);
        } else {
            await addLiveEvent(selectedEvent.name);
        }
    }

    async function addLiveEvent(eventName: string) {
        try {
            const res = await fetch("/api/live-events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slug: newEventSlug,
                    name: eventName,
                    round: newEventRound,
                    location: newEventLocation
                })
            });

            if (res.ok) {
                resetLiveEventForm();
                fetchLiveEvents();
            }
        } catch (error) {
            console.error("Failed to add live event", error);
        }
    }

    async function updateLiveEvent(eventName: string) {
        if (!editingEventId) return;
        try {
            const res = await fetch("/api/live-events", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editingEventId,
                    slug: newEventSlug,
                    name: eventName,
                    round: newEventRound,
                    location: newEventLocation
                })
            });

            if (res.ok) {
                resetLiveEventForm();
                fetchLiveEvents();
            }
        } catch (error) {
            console.error("Failed to update live event", error);
        }
    }

    async function deleteLiveEvent(id: string) {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            const res = await fetch(`/api/live-events?id=${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                if (editingEventId === id) resetLiveEventForm();
                fetchLiveEvents();
            }
        } catch (error) {
            console.error("Failed to delete live event", error);
        }
    }

    function startEditing(event: LiveEvent) {
        setEditingEventId(event.id);
        setNewEventSlug(event.slug);
        setNewEventRound(event.round);
        setNewEventLocation(event.location);
    }

    function resetLiveEventForm() {
        setEditingEventId(null);
        setNewEventSlug("");
        setNewEventRound("");
        setNewEventLocation("");
    }

    const filteredMerchandise = merchandise.filter((item) => {
        // Year Filter
        if (yearFilterValue) {
            const itemYear = parseInt(item.user.year || "0");
            const filterYear = parseInt(yearFilterValue);

            if (!isNaN(itemYear) && !isNaN(filterYear)) {
                if (yearFilterOperator === "gt" && itemYear <= filterYear) return false;
                if (yearFilterOperator === "lt" && itemYear >= filterYear) return false;
            }
        }

        // Campus Filter
        if (merchCampusFilter !== "all" && item.preferredCampus !== merchCampusFilter) {
            return false;
        }

        // Color Filter
        if (merchColorFilter !== "all" && item.color !== merchColorFilter) {
            return false;
        }

        return true;
    });

    const exportUsers = () => {
        if (!users.length) return;
        const headers = ["Name", "Email", "Phone", "College", "Department", "Year", "Role"];
        const rows = users.map(u => [
            u.name,
            u.email,
            u.phone || "",
            u.college || "",
            u.department || "",
            u.year || "",
            u.role
        ]);

        downloadCSV(headers, rows, "all-users.csv");
    };

    const exportMerchandise = () => {
        if (!filteredMerchandise.length) return;
        const headers = ["Order ID", "User Name", "Email", "Phone", "Department", "Year", "Size", "Color", "Campus", "Custom Text", "Status"];
        const rows = filteredMerchandise.map(m => [
            m.id,
            m.user.name,
            m.user.email,
            m.user.phone || "",
            m.user.department || "",
            m.user.year || "",
            m.size || "",
            m.color || "",
            m.preferredCampus,
            m.customText || "",
            m.status || ""
        ]);

        downloadCSV(headers, rows, "merchandise-orders.csv");
    };

    const downloadCSV = (headers: string[], rows: (string)[][], filename: string) => {
        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => {
                const value = String(cell).replace(/"/g, '""');
                return `"${value}"`;
            }).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
            <div className="border-b border-slate-200/70 bg-white/80 backdrop-blur sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
                                <Users className="h-5 w-5" />
                            </div>
                            <h1 className="text-xl font-semibold text-slate-900">SuperAdmin Dashboard</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm text-slate-600">{user.email}</p>
                            </div>
                            <Badge className="bg-slate-900 text-white border-slate-900">SUPERADMIN</Badge>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Tabs defaultValue="users" className="space-y-6">
                    <TabsList className="bg-slate-100 p-1 rounded-lg">
                        <TabsTrigger value="users" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">Users</TabsTrigger>
                        <TabsTrigger value="merchandise" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">Merchandise</TabsTrigger>
                        <TabsTrigger value="live-events" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">Live Events</TabsTrigger>
                    </TabsList>

                    <TabsContent value="users" className="space-y-4">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>All Users</CardTitle>
                                    <CardDescription>Total registered users: {users.length}</CardDescription>
                                </div>
                                <Button onClick={exportUsers} className="bg-slate-900 hover:bg-slate-800 text-white">
                                    <Download className="mr-2 h-4 w-4" /> Export CSV
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {loadingUsers ? (
                                    <div className="space-y-2">
                                        <Skeleton className="h-8 w-full" />
                                        <Skeleton className="h-8 w-full" />
                                        <Skeleton className="h-8 w-full" />
                                    </div>
                                ) : (
                                    <div className="rounded-md border border-slate-200 overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Email</TableHead>
                                                    <TableHead>Phone</TableHead>
                                                    <TableHead>College</TableHead>
                                                    <TableHead>Dept</TableHead>
                                                    <TableHead>Year</TableHead>
                                                    <TableHead>Verified</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {users.map((u) => (
                                                    <TableRow key={u.id}>
                                                        <TableCell className="font-medium">{u.name}</TableCell>
                                                        <TableCell>{u.email}</TableCell>
                                                        <TableCell>{u.phone || "-"}</TableCell>
                                                        <TableCell>{u.college || "-"}</TableCell>
                                                        <TableCell>{u.department || "-"}</TableCell>
                                                        <TableCell>{u.year || "-"}</TableCell>
                                                        <TableCell>
                                                            {u.emailVerified ? (
                                                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                                            ) : (
                                                                <XCircle className="h-4 w-4 text-amber-500" />
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="merchandise" className="space-y-4">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle>Merchandise Orders</CardTitle>
                                        <CardDescription>Total orders: {merchandise.length} | Showing: {filteredMerchandise.length}</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button onClick={exportMerchandise} className="bg-slate-900 hover:bg-slate-800 text-white">
                                            <Download className="mr-2 h-4 w-4" /> Export CSV
                                        </Button>
                                    </div>
                                </div>
                                {/* Filters */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                                    <div className="flex gap-2 col-span-2">
                                        <Select value={yearFilterOperator} onValueChange={(v: "gt" | "lt") => setYearFilterOperator(v)}>
                                            <SelectTrigger className="w-[140px] bg-white text-slate-900 border-slate-200">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-slate-200 text-slate-900">
                                                <SelectItem value="gt" className="text-slate-900 focus:bg-slate-100 focus:text-slate-900">Greater Than</SelectItem>
                                                <SelectItem value="lt" className="text-slate-900 focus:bg-slate-100 focus:text-slate-900">Less Than</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            placeholder="Year (e.g. 2026)"
                                            value={yearFilterValue}
                                            onChange={(e) => setYearFilterValue(e.target.value)}
                                            className="flex-1 bg-white text-slate-900 border-slate-200 placeholder:text-slate-400"
                                        />
                                    </div>

                                    <Select value={merchCampusFilter} onValueChange={setMerchCampusFilter}>
                                        <SelectTrigger className="bg-white text-slate-900 border-slate-200">
                                            <SelectValue placeholder="Filter by Campus" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-slate-200 text-slate-900">
                                            <SelectItem value="all" className="text-slate-900 focus:bg-slate-100 focus:text-slate-900">All Campuses</SelectItem>
                                            <SelectItem value="JADAVPUR" className="text-slate-900 focus:bg-slate-100 focus:text-slate-900">Jadavpur</SelectItem>
                                            <SelectItem value="SALT_LAKE" className="text-slate-900 focus:bg-slate-100 focus:text-slate-900">Salt Lake</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select value={merchColorFilter} onValueChange={setMerchColorFilter}>
                                        <SelectTrigger className="bg-white text-slate-900 border-slate-200">
                                            <SelectValue placeholder="Filter by Color" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-slate-200 text-slate-900">
                                            <SelectItem value="all" className="text-slate-900 focus:bg-slate-100 focus:text-slate-900">All Colors</SelectItem>
                                            <SelectItem value="BLACK" className="text-slate-900 focus:bg-slate-100 focus:text-slate-900">Black</SelectItem>
                                            <SelectItem value="WHITE" className="text-slate-900 focus:bg-slate-100 focus:text-slate-900">White</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {loadingMerch ? (
                                    <div className="space-y-2">
                                        <Skeleton className="h-8 w-full" />
                                        <Skeleton className="h-8 w-full" />
                                        <Skeleton className="h-8 w-full" />
                                    </div>
                                ) : (
                                    <div className="rounded-md border border-slate-200 overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Order ID</TableHead>
                                                    <TableHead>User</TableHead>
                                                    <TableHead>Email</TableHead>
                                                    <TableHead>Phone</TableHead>
                                                    <TableHead>Dept / Year</TableHead>
                                                    <TableHead>Size</TableHead>
                                                    <TableHead>Color</TableHead>
                                                    <TableHead>Campus</TableHead>
                                                    <TableHead>Custom Text</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredMerchandise.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={9} className="text-center py-8 text-slate-500">
                                                            No orders found matching filters.
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    filteredMerchandise.map((m) => (
                                                        <TableRow key={m.id}>
                                                            <TableCell className="font-mono text-xs">{m.id.slice(-6)}</TableCell>
                                                            <TableCell className="font-medium">{m.user.name}</TableCell>
                                                            <TableCell>{m.user.email}</TableCell>
                                                            <TableCell>{m.user.phone || "-"}</TableCell>
                                                            <TableCell>{m.user.department || "-"} / {m.user.year || "-"}</TableCell>
                                                            <TableCell>{m.size || "-"}</TableCell>
                                                            <TableCell>
                                                                {m.color === "BLACK" && <Badge className="bg-black text-white hover:bg-black">Black</Badge>}
                                                                {m.color === "WHITE" && <Badge className="bg-slate-100 text-slate-900 border border-slate-300 hover:bg-slate-100">White</Badge>}
                                                            </TableCell>
                                                            <TableCell>{m.preferredCampus}</TableCell>
                                                            <TableCell className="italic text-slate-600">{m.customText || "-"}</TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="live-events" className="space-y-4">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle>Manage Live Events</CardTitle>
                                <CardDescription>Events added here will be displayed on the homepage ticker.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-50 p-4 rounded-lg border border-slate-200">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Select Event</label>
                                        <Select value={newEventSlug} onValueChange={setNewEventSlug}>
                                            <SelectTrigger className="bg-white text-slate-900 border-slate-200">
                                                <SelectValue placeholder="Choose Event" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-slate-200 max-h-60 text-slate-900">
                                                {mockEvents.map(e => (
                                                    <SelectItem key={e.slug} value={e.slug} className="text-slate-900 focus:bg-slate-100 focus:text-slate-900">{e.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Round</label>
                                        <Select value={newEventRound} onValueChange={setNewEventRound}>
                                            <SelectTrigger className="bg-white text-slate-900 border-slate-200">
                                                <SelectValue placeholder="Round/Stage" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-slate-200 text-slate-900">
                                                <SelectItem value="Prelims" className="text-slate-900 focus:bg-slate-100 focus:text-slate-900">Prelims</SelectItem>
                                                <SelectItem value="Finals" className="text-slate-900 focus:bg-slate-100 focus:text-slate-900">Finals</SelectItem>
                                                <SelectItem value="Medal Ceremony" className="text-slate-900 focus:bg-slate-100 focus:text-slate-900">Medal Ceremony</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Location</label>
                                        <Input
                                            placeholder="e.g. Exam Hall"
                                            value={newEventLocation}
                                            onChange={(e) => setNewEventLocation(e.target.value)}
                                            className="bg-white text-slate-900 border-slate-200 placeholder:text-slate-400"
                                        />
                                    </div>
                                    <Button
                                        onClick={handleLiveEventSubmit}
                                        disabled={!newEventSlug || !newEventRound || !newEventLocation}
                                        className="bg-slate-900 hover:bg-slate-800 text-white min-w-[120px]"
                                    >
                                        <Radio className="mr-2 h-4 w-4" />
                                        {editingEventId ? "Update Event" : "Set Live"}
                                    </Button>
                                    {editingEventId && (
                                        <Button
                                            variant="outline"
                                            onClick={resetLiveEventForm}
                                            className="min-w-[80px] bg-white text-slate-900 border-slate-200 hover:bg-slate-100"
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </div>

                                <div className="rounded-md border border-slate-200 overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50">
                                                <TableHead>Event Name</TableHead>
                                                <TableHead>Round</TableHead>
                                                <TableHead>Location</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loadingLiveEvents ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="h-24 text-center">Loading...</TableCell>
                                                </TableRow>
                                            ) : liveEvents.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                                                        No live events currently active.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                liveEvents.map((event) => (
                                                    <TableRow key={event.id}>
                                                        <TableCell className="font-medium text-slate-900">{event.name}</TableCell>
                                                        <TableCell>{event.round}</TableCell>
                                                        <TableCell>{event.location}</TableCell>
                                                        <TableCell className="text-right flex justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => startEditing(event)}
                                                                className="h-8 bg-white text-slate-900 border-slate-200 hover:bg-slate-100"
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => deleteLiveEvent(event.id)}
                                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
