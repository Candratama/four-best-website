"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Building2, Eye, MapPin, Phone, Mail, Clock, Instagram } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import SocialLinksList from "@/components/admin/SocialLinksList";
import type { CompanyInfo, SocialLink } from "@/lib/db";

interface CompanyInfoFormProps {
  companyInfo: CompanyInfo | null;
  instagramHandle?: string;
  socialLinks?: SocialLink[];
}

export default function CompanyInfoForm({ companyInfo, instagramHandle = "@4best.id", socialLinks }: CompanyInfoFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    address: companyInfo?.address || "",
    phone: companyInfo?.phone || "",
    whatsapp: companyInfo?.whatsapp || "",
    email: companyInfo?.email || "",
    opening_hours: companyInfo?.opening_hours || "",
    map_url: companyInfo?.map_url || "",
  });

  // Dirty-state tracking
  const initialDataRef = useRef(formData);
  const isDirty = useMemo(
    () => JSON.stringify(formData) !== JSON.stringify(initialDataRef.current),
    [formData],
  );

  const handleSubmit = async () => {
    setIsLoading("save");
    try {
      const res = await fetch("/api/admin/company-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || "Gagal menyimpan info perusahaan");
      }
      initialDataRef.current = formData;
      toast.success("Info perusahaan berhasil disimpan!");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form Section */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle>Informasi Kontak</CardTitle>
            </div>
            <CardDescription>
              Informasi ini ditampilkan di footer dan halaman kontak
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Alamat</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, address: e.target.value }))
                  }
                  placeholder="Perum Ungaran Asri, No C1, Ungaran"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="+62 812 3456 7890"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, whatsapp: e.target.value }))
                  }
                  placeholder="+62 812 3456 7890"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Alamat Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="contact@4best.id"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="opening_hours">Jam Operasional</Label>
                <Input
                  id="opening_hours"
                  value={formData.opening_hours}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      opening_hours: e.target.value,
                    }))
                  }
                  placeholder="Sen - Sab 08:00 - 17:00"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="map_url">URL Embed Google Maps</Label>
                <Textarea
                  id="map_url"
                  value={formData.map_url}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, map_url: e.target.value }))
                  }
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Tempel URL embed dari Google Maps (Bagikan → Sematkan peta)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {socialLinks && <SocialLinksList socialLinks={socialLinks} />}
      </div>

      {/* Preview Section */}
      <div>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              <CardTitle>Preview</CardTitle>
            </div>
            <CardDescription>
              Tampilan di halaman Kontak
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-[#f5f5f5] rounded-lg p-5">
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1e293b", marginBottom: "1.25rem" }}>
                Hubungi Kami
              </h3>

              <div className="space-y-4">
                {/* Alamat */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#162d50] flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "2px" }}>
                      ALAMAT
                    </p>
                    <p style={{ fontSize: "0.8rem", color: "#1e293b", lineHeight: 1.4 }}>
                      {formData.address || "Alamat belum diisi"}
                    </p>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#162d50] flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "2px" }}>
                      WHATSAPP
                    </p>
                    <p style={{ fontSize: "0.8rem", color: "#1e293b" }}>
                      {formData.whatsapp || "Belum diisi"}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#162d50] flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "2px" }}>
                      EMAIL
                    </p>
                    <p style={{ fontSize: "0.8rem", color: "#1e293b" }}>
                      {formData.email || "Belum diisi"}
                    </p>
                  </div>
                </div>

                {/* Jam Operasional */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#162d50] flex items-center justify-center flex-shrink-0">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "2px" }}>
                      JAM OPERASIONAL
                    </p>
                    <p style={{ fontSize: "0.8rem", color: "#1e293b" }}>
                      {formData.opening_hours || "Belum diisi"}
                    </p>
                  </div>
                </div>

                {/* Instagram */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#162d50] flex items-center justify-center flex-shrink-0">
                    <Instagram className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "2px" }}>
                      INSTAGRAM
                    </p>
                    <p style={{ fontSize: "0.8rem", color: "#1e293b" }}>
                      {instagramHandle}
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Button */}
              <button
                type="button"
                style={{
                  width: "100%",
                  marginTop: "1.25rem",
                  padding: "10px 20px",
                  backgroundColor: "#25D366",
                  color: "#ffffff",
                  borderRadius: "50px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                <Phone className="h-4 w-4" />
                Hubungi via WhatsApp
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              * Instagram diambil dari pengaturan Media Sosial
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Fixed save button */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 backdrop-blur-sm border-t p-3 md:left-[var(--sidebar-width,256px)] flex justify-center px-4",
          isDirty ? "bg-amber-50/95 border-amber-200" : "bg-background/95",
        )}
      >
        <Button
          onClick={handleSubmit}
          disabled={isLoading === "save" || !isDirty}
          className="w-full max-w-md"
          variant={isDirty ? "default" : "outline"}
        >
          {isLoading === "save" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : isDirty ? (
            "Simpan Perubahan"
          ) : (
            "Tidak Ada Perubahan"
          )}
        </Button>
      </div>
      <div className="h-16 lg:col-span-2" />
    </div>
  );
}
