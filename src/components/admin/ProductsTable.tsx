"use client";

import { useState } from "react";
import { Fragment } from "react";
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
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import MoveButtons from "@/components/admin/MoveButtons";
import type { Product, Partner } from "@/lib/db";

interface ProductsTableProps {
  products: Product[];
  partners: Partner[];
}

export default function ProductsTable({ products, partners }: ProductsTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus perumahan "${name}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || "Gagal menghapus perumahan");
      }
      toast.success("Perumahan berhasil dihapus");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setDeletingId(null);
    }
  };

  // Group products by partner
  const productsByPartner = products.reduce((acc, product) => {
    const pid = product.partner_id;
    if (!acc[pid]) acc[pid] = [];
    acc[pid].push(product);
    return acc;
  }, {} as Record<number, Product[]>);

  // Only show partners that have products
  const partnersWithProducts = partners.filter((p) => productsByPartner[p.id]?.length);

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-white hover:bg-white" style={{ borderBottom: "1px solid #d1d5db" }}>
            <TableHead className="text-center font-semibold pl-14 pr-8 py-4 w-[80px]">Urutan</TableHead>
            <TableHead className="font-semibold px-8 py-4">Nama Perumahan</TableHead>
            <TableHead className="text-center font-semibold px-8 py-4">Kategori</TableHead>
            <TableHead className="text-center font-semibold px-8 py-4">Status</TableHead>
            <TableHead className="text-center font-semibold px-8 py-4">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                Belum ada perumahan. Buat perumahan pertama Anda.
              </TableCell>
            </TableRow>
          ) : (
            partnersWithProducts.map((partner) => {
              const partnerProducts = productsByPartner[partner.id];
              return partnerProducts.map((product, index) => (
                <Fragment key={product.id}>
                  {index === 0 && (
                    <TableRow key={`group-${partner.id}`} className="bg-muted/40 hover:bg-muted/40">
                      <TableCell colSpan={5} className="px-8 py-2.5">
                        <span className="text-sm font-semibold text-muted-foreground">
                          {partner.name}
                        </span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {partnerProducts.length}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow key={product.id} className="bg-white hover:bg-muted/30">
                    <TableCell className="text-center pl-14 pr-8 py-4">
                      <MoveButtons
                        id={product.id}
                        isFirst={index === 0}
                        isLast={index === partnerProducts.length - 1}
                        prevId={index > 0 ? partnerProducts[index - 1].id : undefined}
                        nextId={index < partnerProducts.length - 1 ? partnerProducts[index + 1].id : undefined}
                        apiEndpoint="/api/admin/products/reorder"
                      />
                    </TableCell>
                    <TableCell className="font-medium px-8 py-4">{product.name}</TableCell>
                    <TableCell className="text-center px-8 py-4">
                      <Badge
                        className={product.category === "commercial"
                          ? "bg-blue-900 hover:bg-blue-950 text-white"
                          : "bg-orange-500 hover:bg-orange-600 text-white"
                        }
                      >
                        {product.category === "commercial" ? "Komersial" : "Subsidi"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center px-8 py-4">
                      <Badge variant={product.is_active ? "default" : "secondary"}>
                        {product.is_active ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center px-8 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={`/admin/products/${product.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={deletingId === product.id}
                        >
                          {deletingId === product.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </Fragment>
              ));
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
