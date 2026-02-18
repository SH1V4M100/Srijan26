import { prisma } from "@/prisma/client";
import { checkSuperAdminAuthorization } from "@/services/AuthService";
import CreateCaForm from "@/components/admin/CreateCaForm";
import CaList from "@/components/admin/CaList";

export const dynamic = "force-dynamic";

export default async function CampusAmbassadorsPage() {
    await checkSuperAdminAuthorization();

    const ambassadors = await prisma.campusAmbassador.findMany({
        orderBy: { referralCount: "desc" }
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-slate-900">Campus Ambassadors</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Form */}
                <div className="lg:col-span-1">
                    <CreateCaForm />
                </div>

                {/* List & Stats */}
                <div className="lg:col-span-2">
                    <CaList ambassadors={ambassadors} />
                </div>
            </div>
        </div>
    );
}
