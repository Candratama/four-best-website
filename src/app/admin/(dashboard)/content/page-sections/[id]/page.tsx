import { notFound } from "next/navigation";
import { getPageSectionById } from "@/lib/db";
import PageSectionForm from "@/components/admin/PageSectionForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPageSectionPage({ params }: Props) {
  const { id } = await params;
  const pageSection = await getPageSectionById(parseInt(id));

  if (!pageSection) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Edit Section: {pageSection.section_key.replace(/-/g, " ")}
      </h1>
      <p className="text-muted-foreground">
        Page: <span className="capitalize">{pageSection.page_slug}</span>
      </p>
      <PageSectionForm pageSection={pageSection} />
    </div>
  );
}
