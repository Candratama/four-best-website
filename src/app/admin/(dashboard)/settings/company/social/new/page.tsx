import SocialLinkForm from "@/components/admin/SocialLinkForm";

export default function NewSocialLinkPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tambah Media Sosial</h1>
      <SocialLinkForm mode="create" />
    </div>
  );
}
