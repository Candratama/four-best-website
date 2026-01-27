import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserCheck, TrendingUp, Shield, Award, Target } from "lucide-react";

interface ValueItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

const values: ValueItem[] = [
  {
    icon: <UserCheck className="h-8 w-8" strokeWidth={1.5} />,
    title: "Pendekatan Personal",
    description:
      "Setiap klien ditangani secara khusus sesuai kebutuhan dan tujuan.",
  },
  {
    icon: <TrendingUp className="h-8 w-8" strokeWidth={1.5} />,
    title: "Market Insight Akurat",
    description: "Analisis pasar yang tepat untuk hasil optimal.",
  },
  {
    icon: <Shield className="h-8 w-8" strokeWidth={1.5} />,
    title: "Proses Transparan & Aman",
    description: "Komunikasi jelas dari awal hingga transaksi selesai.",
  },
  {
    icon: <Award className="h-8 w-8" strokeWidth={1.5} />,
    title: "Agen Profesional & Terpercaya",
    description: "Berpengalaman dan berorientasi pada kepuasan klien.",
    className: "md:col-span-2",
  },
  {
    icon: <Target className="h-8 w-8" strokeWidth={1.5} />,
    title: "Fokus Nilai Investasi",
    description: "Membantu memaksimalkan potensi jangka pendek dan panjang.",
  },
];

export default function ValueProposition() {
  return (
    <section className="py-20 ">
      <div className="container">
        <div className="text-center mb-12">
          <div className="subtitle s2 mb-3">Mengapa Memilih Kami</div>
          <h2 className="text-3xl md:text-4xl font-bold">Value Proposition</h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {values.map((item, index) => (
            <Card
              key={index}
              className={`group hover:shadow-lg hover:scale-105 transition-all duration-300 border-border/50 hover:border-primary/30 ${
                item.className || ""
              }`}
            >
              <CardHeader className="pb-2">
                <div className="icon-box w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-all duration-300 text-[#162d50] group-hover:text-white">
                  {item.icon}
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {item.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
