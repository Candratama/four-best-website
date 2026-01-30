import { notFound } from "next/navigation";
import { getPartnerById } from "@/lib/db";
import PartnerForm from "@/components/admin/PartnerForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPartnerPage({ params }: Props) {
  const { id } = await params;
  const partner = await getPartnerById(parseInt(id));

  if (!partner) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Partner: {partner.name}</h1>
      <PartnerForm partner={partner} mode="edit" />
    </div>
  );
}
