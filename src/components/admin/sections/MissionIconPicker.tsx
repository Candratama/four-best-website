"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getMissionIcon, defaultIconCycle, iconPickerOptions } from "./mission-icons";

export default function MissionIconPicker({
  icon,
  index,
  isActive,
  onSelect,
}: {
  icon: string | null;
  index: number;
  isActive: boolean;
  onSelect: (icon: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const CurrentIcon = getMissionIcon(icon, index);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center justify-center shrink-0 mt-1.5 cursor-pointer hover:opacity-80 transition-opacity"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            backgroundColor: isActive ? "#162d50" : "#94a3b8",
            color: "#fff",
            border: "none",
          }}
          title="Ganti icon"
        >
          <CurrentIcon className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <p className="text-xs font-medium text-muted-foreground mb-2">
          Pilih Icon
        </p>
        <div className="grid grid-cols-6 gap-1">
          {iconPickerOptions.map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                onSelect(key);
                setOpen(false);
              }}
              className={`flex items-center justify-center p-2 rounded-md transition-colors hover:bg-muted ${
                icon === key ||
                (!icon &&
                  defaultIconCycle[index % defaultIconCycle.length] === key)
                  ? "bg-primary/10 ring-1 ring-primary"
                  : ""
              }`}
              title={label}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
