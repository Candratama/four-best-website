import HeroSlideForm from "@/components/admin/HeroSlideForm";

export default function NewHeroSlidePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add New Hero Slide</h1>
      <HeroSlideForm mode="create" />
    </div>
  );
}
