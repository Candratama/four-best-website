"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimePickerProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  timeOptions?: string[];
}

export function TimePicker({
  value,
  onValueChange,
  placeholder = "Pilih waktu",
  className,
  disabled = false,
  timeOptions = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ],
}: TimePickerProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger 
        className={cn(
          "!w-full !h-[50px] !px-4 !gap-3 !bg-white !border !border-gray-300 !rounded-md !transition-colors hover:!border-gray-400 focus:!outline-none focus:!border-primary focus:!ring-2 focus:!ring-primary/20 !justify-start !text-left",
          "[&>svg:last-child]:!ml-auto [&>svg:last-child]:!h-4 [&>svg:last-child]:!w-4",
          className
        )}
      >
        <Clock className="h-5 w-5 text-gray-400 flex-shrink-0" />
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {timeOptions.map((time) => (
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
