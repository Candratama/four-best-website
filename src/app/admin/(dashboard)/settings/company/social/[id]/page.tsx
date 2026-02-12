import { notFound } from "next/navigation";
import { getSocialLinkById } from "@/lib/db";
import SocialLinkForm from "@/components/admin/SocialLinkForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditSocialLinkPage({ params }: Props) {
  const { id } = await params;
  const socialLink = await getSocialLinkById(parseInt(id));

  if (!socialLink) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Media Sosial</h1>
      <SocialLinkForm socialLink={socialLink} mode="edit" />
    </div>
  );
}
