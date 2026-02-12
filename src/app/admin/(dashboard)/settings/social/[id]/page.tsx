import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditSocialLinkRedirect({ params }: Props) {
  const { id } = await params;
  redirect(`/admin/settings/company/social/${id}`);
}
