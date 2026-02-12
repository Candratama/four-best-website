"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, GripVertical, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Mission } from "./types";
import MissionIconPicker from "./MissionIconPicker";

export default function MissionItemsManager({
  items,
  onItemsChange,
}: {
  items: Mission[];
  onItemsChange: (items: Mission[]) => void;
}) {
  const [savingId, setSavingId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const saveMission = async (id: number, data: Partial<Mission>) => {
    setSavingId(`save-${id}`);
    try {
      const res = await fetch(`/api/admin/missions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      toast.success("Misi berhasil disimpan");
    } catch {
      toast.error("Gagal menyimpan misi");
    } finally {
      setSavingId(null);
    }
  };

  const deleteMission = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus misi ini?")) return;
    setSavingId(`delete-${id}`);
    try {
      const res = await fetch(`/api/admin/missions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus");
      onItemsChange(items.filter((m) => m.id !== id));
      toast.success("Misi berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus misi");
    } finally {
      setSavingId(null);
    }
  };

  const addMission = async () => {
    setSavingId("add");
    try {
      const res = await fetch("/api/admin/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "", is_active: 1 }),
      });
      if (!res.ok) throw new Error("Gagal menambahkan");
      const { id } = (await res.json()) as { id: number };
      const newMission: Mission = {
        id,
        icon: null,
        text: "",
        is_active: 1,
        display_order: items.length,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      onItemsChange([...items, newMission]);
      toast.success("Misi baru ditambahkan");
    } catch {
      toast.error("Gagal menambahkan misi");
    } finally {
      setSavingId(null);
    }
  };

  const handleTextChange = (id: number, text: string) => {
    onItemsChange(items.map((m) => (m.id === id ? { ...m, text } : m)));
  };

  const handleTextBlur = (id: number, text: string) => {
    saveMission(id, { text });
  };

  const handleToggleActive = (id: number, checked: boolean) => {
    const newActive = checked ? 1 : 0;
    onItemsChange(
      items.map((m) => (m.id === id ? { ...m, is_active: newActive } : m)),
    );
    saveMission(id, { is_active: newActive });
  };

  const handleIconChange = (id: number, icon: string) => {
    onItemsChange(items.map((m) => (m.id === id ? { ...m, icon } : m)));
    saveMission(id, { icon });
  };

  const saveReorder = async (newItems: Mission[]) => {
    const ids = newItems.map((m) => m.id);
    try {
      const res = await fetch("/api/admin/missions/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error("Gagal mengurutkan");
      toast.success("Urutan misi diperbarui");
    } catch {
      toast.error("Gagal mengurutkan misi");
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newItems = [...items];
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, removed);
    const reordered = newItems.map((m, i) => ({ ...m, display_order: i }));
    onItemsChange(reordered);
    saveReorder(reordered);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kelola Misi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((mission, index) => (
          <div
            key={mission.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={() => handleDrop(index)}
            onDragEnd={handleDragEnd}
            className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
              draggedIndex === index ? "opacity-50" : ""
            } ${dragOverIndex === index && draggedIndex !== index ? "border-primary bg-primary/5" : ""}`}
          >
            {/* Drag handle */}
            <div className="cursor-grab pt-2 text-muted-foreground hover:text-foreground active:cursor-grabbing">
              <GripVertical className="h-4 w-4" />
            </div>

            {/* Icon picker */}
            <MissionIconPicker
              icon={mission.icon}
              index={index}
              isActive={mission.is_active === 1}
              onSelect={(icon) => handleIconChange(mission.id, icon)}
            />

            {/* Text input */}
            <div className="flex-1 min-w-0">
              <Textarea
                value={mission.text}
                onChange={(e) => handleTextChange(mission.id, e.target.value)}
                onBlur={(e) => handleTextBlur(mission.id, e.target.value)}
                placeholder="Tulis misi..."
                rows={2}
                className="resize-none text-sm"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center gap-2 pt-1">
              <Switch
                checked={mission.is_active === 1}
                onCheckedChange={(checked) =>
                  handleToggleActive(mission.id, checked)
                }
              />
              {savingId === `save-${mission.id}` ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => deleteMission(mission.id)}
                  disabled={savingId === `delete-${mission.id}`}
                >
                  {savingId === `delete-${mission.id}` ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </Button>
              )}
            </div>
          </div>
        ))}

        {/* Add mission button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={addMission}
          disabled={savingId === "add"}
        >
          {savingId === "add" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Tambah Misi
        </Button>
      </CardContent>
    </Card>
  );
}
