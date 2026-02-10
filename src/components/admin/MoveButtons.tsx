"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

interface MoveButtonsProps {
  id: number;
  isFirst: boolean;
  isLast: boolean;
  prevId?: number;
  nextId?: number;
  apiEndpoint: string;
}

export default function MoveButtons({
  id,
  isFirst,
  isLast,
  prevId,
  nextId,
  apiEndpoint
}: MoveButtonsProps) {
  const router = useRouter();

  const handleMove = async (targetId: number) => {
    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id1: id, id2: targetId }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error reordering:", error);
    }
  };

  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => prevId && handleMove(prevId)}
        disabled={isFirst}
        className="h-8 w-8 p-0"
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => nextId && handleMove(nextId)}
        disabled={isLast}
        className="h-8 w-8 p-0"
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
