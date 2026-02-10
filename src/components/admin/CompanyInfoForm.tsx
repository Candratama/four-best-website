"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Building2, Eye, MapPin, Phone, Mail, Clock, Instagram } from "lucide-react";
import type { CompanyInfo } from "@/lib/db";

interface CompanyInfoFormProps {
  companyInfo: CompanyInfo | null;
  instagramHandle?: string;
}

export default function CompanyInfoForm({ companyInfo, instagramHandle = "@4best.id" }: CompanyInfoFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    address: companyInfo?.address || "",
    phone: companyInfo?.phone || "",
    whatsapp: companyInfo?.whatsapp || "",
    email: companyInfo?.email || "",
    opening_hours: companyInfo?.opening_hours || "",
    map_url: companyInfo?.map_url || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/company-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error || "Failed to save company info");
      }

      setSuccess("Company info saved successfully!");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form Section */}
      <div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md">
              {success}
            </div>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle>Contact Information</CardTitle>
              </div>
              <CardDescription>
                This information is displayed in the website footer and contact page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
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
                  <Label htmlFor="phone">Phone Number</Label>
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
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
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
                  <Label htmlFor="email">Email Address</Label>
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
                  <Label htmlFor="opening_hours">Opening Hours</Label>
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
                  <Label htmlFor="map_url">Google Maps Embed URL</Label>
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
                    Paste the embed URL from Google Maps (Share → Embed a map)
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
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
              * Instagram diambil dari pengaturan Social Links
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
