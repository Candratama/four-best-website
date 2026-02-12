"use client";

import { motion } from "framer-motion";
import {
  Handshake, Users, Laptop, Heart, Target, Star, Shield, Lightbulb, TrendingUp,
  Building2, Home, Award, Briefcase, Globe, Rocket, Zap, CheckCircle, ThumbsUp,
  type LucideIcon,
} from "lucide-react";
import { fadeInUp } from "@/lib/animations";

interface MissionItem {
  text: string;
  icon?: string;
}

interface VisionMissionProps {
  visionSubtitle?: string;
  visionTitle?: string;
  visionText: string;
  missionSubtitle?: string;
  missionTitle?: string;
  missions?: MissionItem[];
}

const iconMap: Record<string, LucideIcon> = {
  handshake: Handshake,
  users: Users,
  laptop: Laptop,
  heart: Heart,
  target: Target,
  star: Star,
  shield: Shield,
  lightbulb: Lightbulb,
  "trending-up": TrendingUp,
  building: Building2,
  home: Home,
  award: Award,
  briefcase: Briefcase,
  globe: Globe,
  rocket: Rocket,
  zap: Zap,
  "check-circle": CheckCircle,
  "thumbs-up": ThumbsUp,
};

const defaultIconCycle: LucideIcon[] = [Handshake, Users, Laptop, Heart];

function getMissionIcon(icon: string | undefined, index: number): LucideIcon {
  if (icon && iconMap[icon]) return iconMap[icon];
  return defaultIconCycle[index % defaultIconCycle.length];
}

const defaultMissions: MissionItem[] = [
  {
    text: "Memberikan layanan pemasaran properti yang jujur, transparan, dan bertanggung jawab kepada setiap klien. Mengutamakan kepuasan klien melalui strategi pemasaran yang efektif dan tepat sasaran.",
  },
  {
    text: "Mengembangkan tim yang kompeten, berintegritas, dan berdaya saing tinggi di bidang properti.",
  },
  {
    text: "Memanfaatkan teknologi dan media digital secara optimal untuk meningkatkan jangkauan dan kecepatan pemasaran.",
  },
  {
    text: "Membangun hubungan jangka panjang dengan klien, mitra, dan developer berdasarkan kepercayaan dan profesionalisme.",
  },
];

export default function VisionMission({
  visionSubtitle = "Visi Kami",
  visionTitle = "Menjadi yang Terdepan",
  visionText,
  missionSubtitle = "Misi Kami",
  missionTitle = "Komitmen untuk Hasil Terbaik",
  missions = defaultMissions,
}: VisionMissionProps) {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        {/* Vision Section - Top */}
        <div className="row mb-5">
          <div className="col-lg-8 offset-lg-2 text-center">
            <motion.div
              className="subtitle s2"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {visionSubtitle}
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {visionTitle}
            </motion.h2>
            <motion.p
              className="fs-18 lh-1-8"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              style={{ color: "#555" }}
            >
              {visionText}
            </motion.p>
          </div>
        </div>

        {/* Divider */}
        <div className="row mb-5">
          <div className="col-12">
            <hr style={{ borderColor: "rgba(0,0,0,0.1)" }} />
          </div>
        </div>

        {/* Mission Section - Bottom */}
        <div className="row">
          <div className="col-lg-8 offset-lg-2 text-center mb-4">
            <motion.div
              className="subtitle s2"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {missionSubtitle}
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {missionTitle}
            </motion.h2>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8 offset-lg-2" style={{ overflow: "hidden" }}>
            <ul className="list-unstyled" style={{ width: "100%" }}>
              {missions.map((mission, index) => (
                <motion.li
                  key={index}
                  className="d-flex align-items-start py-4"
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  style={{
                    gap: "16px",
                    borderBottom:
                      index < missions.length - 1
                        ? "1px solid rgba(0,0,0,0.1)"
                        : "none",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="icon-box d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      backgroundColor: "var(--primary-color)",
                      color: "#fff",
                    }}
                  >
                    {(() => { const Icon = getMissionIcon(mission.icon, index); return <Icon className="h-5 w-5" strokeWidth={1.5} />; })()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                    <p
                      className="mb-0 lh-1-7"
                      style={{
                        color: "#555",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {mission.text}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
