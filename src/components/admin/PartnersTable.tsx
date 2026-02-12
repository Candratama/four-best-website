"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import MoveButtons from "@/components/admin/MoveButtons";
import type { Partner } from "@/lib/db";

export default function PartnersTable({ partners }: { partners: Partner[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus partner "${name}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/partners/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || "Gagal menghapus partner");
      }
      toast.success("Partner berhasil dihapus");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-white hover:bg-white" style={{ borderBottom: "1px solid #d1d5db" }}>
            <TableHead className="text-center font-semibold pl-14 pr-8 py-4 w-[80px]">Urutan</TableHead>
            <TableHead className="font-semibold px-8 py-4">Nama Partner</TableHead>
            <TableHead className="text-center font-semibold px-8 py-4">Unggulan</TableHead>
            <TableHead className="text-center font-semibold px-8 py-4">Status</TableHead>
            <TableHead className="text-center font-semibold px-8 py-4">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                Belum ada partner. Buat partner pertama Anda.
              </TableCell>
            </TableRow>
          ) : (
            partners.map((partner, index) => (
              <TableRow key={partner.id} className="bg-white hover:bg-muted/30">
                <TableCell className="text-center pl-14 pr-8 py-4">
                  <MoveButtons
                    id={partner.id}
                    isFirst={index === 0}
                    isLast={index === partners.length - 1}
                    prevId={index > 0 ? partners[index - 1].id : undefined}
                    nextId={index < partners.length - 1 ? partners[index + 1].id : undefined}
                    apiEndpoint="/api/admin/partners/reorder"
                  />
                </TableCell>
                <TableCell className="font-medium px-8 py-4">{partner.name}</TableCell>
                <TableCell className="text-center px-8 py-4">
                  {partner.is_featured ? (
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mx-auto" />
                  ) : (
                    <Star className="h-4 w-4 text-gray-300 mx-auto" />
                  )}
                </TableCell>
                <TableCell className="text-center px-8 py-4">
                  <Badge variant={partner.is_active ? "default" : "secondary"}>
                    {partner.is_active ? "Aktif" : "Nonaktif"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center px-8 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={`/admin/partners/${partner.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(partner.id, partner.name)}
                      disabled={deletingId === partner.id}
                    >
                      {deletingId === partner.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
