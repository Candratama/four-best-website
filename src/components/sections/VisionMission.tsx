"use client";

import { Handshake, Users, Laptop, Heart } from "lucide-react";

interface MissionItem {
  text: string;
}

interface VisionMissionProps {
  visionSubtitle?: string;
  visionTitle?: string;
  visionText: string;
  missionSubtitle?: string;
  missionTitle?: string;
  missions?: MissionItem[];
}

// Default icons for missions
const missionIcons = [
  <Handshake key="handshake" className="h-5 w-5" strokeWidth={1.5} />,
  <Users key="users" className="h-5 w-5" strokeWidth={1.5} />,
  <Laptop key="laptop" className="h-5 w-5" strokeWidth={1.5} />,
  <Heart key="heart" className="h-5 w-5" strokeWidth={1.5} />,
];

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
            <div className="subtitle s2 wow fadeInUp">{visionSubtitle}</div>
            <h2 className="wow fadeInUp" data-wow-delay=".2s">
              {visionTitle}
            </h2>
            <p
              className="fs-18 lh-1-8 wow fadeInUp"
              data-wow-delay=".4s"
              style={{ color: "#555" }}
            >
              {visionText}
            </p>
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
            <div className="subtitle s2 wow fadeInUp">{missionSubtitle}</div>
            <h2 className="wow fadeInUp" data-wow-delay=".2s">
              {missionTitle}
            </h2>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8 offset-lg-2" style={{ overflow: "hidden" }}>
            <ul className="list-unstyled" style={{ width: "100%" }}>
              {missions.map((mission, index) => (
                <li
                  key={index}
                  className="d-flex align-items-start py-4 wow fadeInUp"
                  data-wow-delay={`${0.2 + index * 0.1}s`}
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
                    {missionIcons[index % missionIcons.length]}
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
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
