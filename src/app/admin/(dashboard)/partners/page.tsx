import Link from "next/link";
import { getPartners } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PartnersTable from "@/components/admin/PartnersTable";

export const dynamic = "force-dynamic";

export default async function PartnersListPage() {
  const partners = await getPartners();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Partners</h1>
        <Link href="/admin/partners/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Partner
          </Button>
        </Link>
      </div>

      <PartnersTable partners={partners} />
    </div>
  );
}
