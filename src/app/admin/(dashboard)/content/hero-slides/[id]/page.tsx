import { notFound } from "next/navigation";
import { getHeroSlideById } from "@/lib/db";
import HeroSlideForm from "@/components/admin/HeroSlideForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditHeroSlidePage({ params }: Props) {
  const { id } = await params;
  const heroSlide = await getHeroSlideById(parseInt(id));

  if (!heroSlide) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Hero Slide</h1>
      <HeroSlideForm heroSlide={heroSlide} mode="edit" />
    </div>
  );
}
