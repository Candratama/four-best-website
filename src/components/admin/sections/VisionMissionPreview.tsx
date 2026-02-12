"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { getMissionIcon } from "./mission-icons";
import type { AboutFormData, Mission } from "./types";

export default function VisionMissionPreview({
  data,
  missions,
}: {
  data: AboutFormData;
  missions: Mission[];
}) {
  const activeMissions = missions.filter((m) => m.is_active);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          <CardTitle>Preview</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg overflow-hidden">
          {/* Vision Section */}
          <div className="bg-muted/30 p-6 lg:p-8 text-center">
            <span
              style={{
                color: "#162d50",
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              {data.vision_subtitle || "Visi Kami"}
            </span>
            <h2
              style={{
                color: "#1e293b",
                fontSize: "1.5rem",
                fontWeight: 700,
                marginTop: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              {data.vision_title || "Menjadi yang Terdepan"}
            </h2>
            <p
              style={{
                color: "#555",
                fontSize: "0.875rem",
                lineHeight: 1.8,
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              {data.vision_text || "Visi perusahaan..."}
            </p>
          </div>

          {/* Divider */}
          <div className="px-6 lg:px-8 bg-muted/30">
            <hr style={{ borderColor: "rgba(0,0,0,0.1)" }} />
          </div>

          {/* Mission Section */}
          <div className="bg-muted/30 p-6 lg:p-8">
            <div className="text-center mb-4">
              <span
                style={{
                  color: "#162d50",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                {data.mission_subtitle || "Misi Kami"}
              </span>
              <h2
                style={{
                  color: "#1e293b",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  marginTop: "0.5rem",
                }}
              >
                {data.mission_title || "Komitmen untuk Hasil Terbaik"}
              </h2>
            </div>

            {activeMissions.length > 0 ? (
              <div className="max-w-2xl mx-auto">
                <ul className="list-none p-0 m-0">
                  {activeMissions.map((mission, index) => (
                    <li
                      key={mission.id}
                      className="flex items-start gap-4 py-4"
                      style={{
                        borderBottom:
                          index < activeMissions.length - 1
                            ? "1px solid rgba(0,0,0,0.1)"
                            : "none",
                      }}
                    >
                      <div
                        className="flex items-center justify-center shrink-0"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "10px",
                          backgroundColor: "#162d50",
                          color: "#fff",
                        }}
                      >
                        {(() => {
                          const Icon = getMissionIcon(mission.icon, index);
                          return <Icon className="h-5 w-5" strokeWidth={1.5} />;
                        })()}
                      </div>
                      <p
                        className="mb-0"
                        style={{ color: "#555", lineHeight: 1.7, flex: 1 }}
                      >
                        {mission.text || "..."}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "0.875rem",
                  textAlign: "center",
                }}
              >
                Belum ada misi. Tambahkan misi di bawah.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
