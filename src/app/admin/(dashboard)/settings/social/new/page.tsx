import { redirect } from "next/navigation";

export default function NewSocialLinkRedirect() {
  redirect("/admin/settings/company/social/new");
}
