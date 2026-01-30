import PartnerForm from "@/components/admin/PartnerForm";

export default function NewPartnerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add New Partner</h1>
      <PartnerForm mode="create" />
    </div>
  );
}
