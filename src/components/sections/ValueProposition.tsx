import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserCheck, TrendingUp, Shield, Award, Target, LucideIcon } from "lucide-react";
import type { ValueProposition as ValuePropositionType } from "@/lib/db";

// Icon mapping from string to Lucide component
const iconMap: Record<string, LucideIcon> = {
  UserCheck,
  TrendingUp,
  Shield,
  Award,
  Target,
};

interface ValuePropositionProps {
  items?: ValuePropositionType[];
}

// Default values for fallback
const defaultValues: ValuePropositionType[] = [
  {
    id: 1,
    icon: "UserCheck",
    title: "Pendekatan Personal",
    description: "Setiap klien ditangani secara khusus sesuai kebutuhan dan tujuan.",
    grid_class: null,
    is_active: 1,
    display_order: 1,
    created_at: "",
    updated_at: "",
  },
  {
    id: 2,
    icon: "TrendingUp",
    title: "Market Insight Akurat",
    description: "Analisis pasar yang tepat untuk hasil optimal.",
    grid_class: null,
    is_active: 1,
    display_order: 2,
    created_at: "",
    updated_at: "",
  },
  {
    id: 3,
    icon: "Shield",
    title: "Proses Transparan & Aman",
    description: "Komunikasi jelas dari awal hingga transaksi selesai.",
    grid_class: null,
    is_active: 1,
    display_order: 3,
    created_at: "",
    updated_at: "",
  },
  {
    id: 4,
    icon: "Award",
    title: "Agen Profesional & Terpercaya",
    description: "Berpengalaman dan berorientasi pada kepuasan klien.",
    grid_class: "md:col-span-2",
    is_active: 1,
    display_order: 4,
    created_at: "",
    updated_at: "",
  },
  {
    id: 5,
    icon: "Target",
    title: "Fokus Nilai Investasi",
    description: "Membantu memaksimalkan potensi jangka pendek dan panjang.",
    grid_class: null,
    is_active: 1,
    display_order: 5,
    created_at: "",
    updated_at: "",
  },
];

export default function ValueProposition({ items }: ValuePropositionProps) {
  const values = items && items.length > 0 ? items : defaultValues;

  return (
    <section className="py-20 ">
      <div className="container">
        <div className="text-center mb-12">
          <div className="subtitle s2 mb-3">Mengapa Memilih Kami</div>
          <h2 className="text-3xl md:text-4xl font-bold">Keunggulan Kami</h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {values.map((item) => {
            const IconComponent = iconMap[item.icon] || UserCheck;
            return (
              <Card
                key={item.id}
                className={`group hover:shadow-lg hover:scale-105 transition-all duration-300 border-border/50 hover:border-primary/30 ${
                  item.grid_class || ""
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="icon-box w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 transition-all duration-300 text-[#162d50]">
                    <IconComponent className="h-8 w-8" strokeWidth={1.5} />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
