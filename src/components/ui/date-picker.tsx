"use client";

import * as React from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pilih tanggal",
  className,
  disabled = false,
}: DatePickerProps) {
  // Get today's date at midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            height: '50px',
            padding: '0 16px',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            textAlign: 'left',
            fontWeight: 'normal',
            transition: 'all 0.2s',
          }}
          className={cn(
            "hover:border-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
            !date && "text-gray-500",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
          {date ? (
            <span className="text-gray-900">{format(date, "PPP", { locale: id })}</span>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
          locale={id}
          disabled={(date) => date < today}
          fromDate={today}
        />
      </PopoverContent>
    </Popover>
  );
}
