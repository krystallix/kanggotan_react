"use client"

import { useState } from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DayPicker } from "react-day-picker"

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
]

interface DatePickerFieldProps {
  value: string
  onChange: (value: string) => void
  year: string
}

export function DatePickerField({ value, onChange, year }: DatePickerFieldProps) {
  const parsed = value ? new Date(value + "T00:00:00") : undefined
  const [viewMonth, setViewMonth] = useState<Date>(
    parsed || new Date(Number(year) || new Date().getFullYear(), 0)
  )
  const [open, setOpen] = useState(false)

  const handleSelect = (selected: Date | undefined) => {
    if (!selected) return
    const y = String(selected.getFullYear()).padStart(4, "0")
    const m = String(selected.getMonth() + 1).padStart(2, "0")
    const d = String(selected.getDate()).padStart(2, "0")
    onChange(`${y}-${m}-${d}`)
    setOpen(false)
  }

  const displayDate = parsed
    ? format(parsed, "d MMMM yyyy", { locale: id })
    : ""

  const currentMonth = viewMonth.getMonth()
  const currentYear = viewMonth.getFullYear()

  const years = Array.from({ length: 10 }, (_, i) => currentYear - 4 + i)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 size-4 shrink-0" />
          {displayDate || "Pilih tanggal"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {/* Header: prev / month+year selects / next */}
        <div className="flex items-center gap-1 px-3 pt-3 pb-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 shrink-0"
            onClick={() =>
              setViewMonth(new Date(currentYear, currentMonth - 1))
            }
          >
            <ChevronLeft className="size-4" />
          </Button>

          <div className="flex flex-1 items-center justify-center gap-1">
            <Select
              value={String(currentMonth)}
              onValueChange={(v) =>
                setViewMonth(new Date(currentYear, Number(v)))
              }
            >
              <SelectTrigger className="h-7 w-[110px] text-sm font-medium border-0 shadow-none px-2 focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m, i) => (
                  <SelectItem key={i} value={String(i)} className="text-sm">
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={String(currentYear)}
              onValueChange={(v) =>
                setViewMonth(new Date(Number(v), currentMonth))
              }
            >
              <SelectTrigger className="h-7 w-[72px] text-sm font-medium border-0 shadow-none px-2 focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)} className="text-sm">
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="size-7 shrink-0"
            onClick={() =>
              setViewMonth(new Date(currentYear, currentMonth + 1))
            }
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        <DayPicker
          mode="single"
          selected={parsed}
          onSelect={handleSelect}
          month={viewMonth}
          onMonthChange={setViewMonth}
          locale={id}
          showOutsideDays
          classNames={{
            months: "p-3 pt-0",
            month: "flex flex-col gap-4",
            month_caption: "hidden",
            nav: "hidden",
            month_grid: "w-full border-collapse",
            weekdays: "flex",
            weekday: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] text-center",
            week: "flex w-full mt-2",
            day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
            day_button: cn(
              "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors size-8 p-0",
              "hover:bg-accent hover:text-accent-foreground aria-selected:opacity-100"
            ),
            selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
            today: "bg-accent text-accent-foreground rounded-md",
            outside: "text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
            disabled: "text-muted-foreground opacity-50",
            hidden: "invisible",
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
