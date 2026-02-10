import Link from "next/link";
import { getPartners } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import MoveButtons from "@/components/admin/MoveButtons";

export const dynamic = "force-dynamic";

export default async function PartnersListPage() {
  const partners = await getPartners();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Partners</h1>
        <Link href="/admin/partners/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Partner
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="border-r text-center w-[80px]">Order</TableHead>
              <TableHead className="border-r text-center">Name</TableHead>
              <TableHead className="border-r text-center">Featured</TableHead>
              <TableHead className="border-r text-center">Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.map((partner, index) => (
              <TableRow key={partner.id}>
                <TableCell className="text-center">
                  <MoveButtons
                    id={partner.id}
                    isFirst={index === 0}
                    isLast={index === partners.length - 1}
                    prevId={index > 0 ? partners[index - 1].id : undefined}
                    nextId={index < partners.length - 1 ? partners[index + 1].id : undefined}
                    apiEndpoint="/api/admin/partners/reorder"
                  />
                </TableCell>
                <TableCell className="font-medium">{partner.name}</TableCell>
                <TableCell className="text-center">
                  {partner.is_featured ? (
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mx-auto" />
                  ) : (
                    <Star className="h-4 w-4 text-gray-300 mx-auto" />
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={partner.is_active ? "default" : "secondary"}>
                    {partner.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Link href={`/admin/partners/${partner.id}`}>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {partners.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No partners found. Create your first partner.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
