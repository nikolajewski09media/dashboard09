import * as React from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { useStore } from "@nanostores/react";
import { dates, setDates } from "@/utils/dataStore";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const $dates = useStore(dates);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: $dates.from,
    to: $dates.to,
  });

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "min-w-[205px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd.MM.yyy")} -{" "}
                  {format(date.to, "dd.MM.yyy")}
                </>
              ) : (
                format(date.from, "dd.MM.yyy")
              )
            ) : (
              <span>Datum auswählen</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(dateRange, day) => {
              setDate({
                from: dateRange?.from || day,
                to: dateRange?.to || day,
              });
              setDates({
                from: dateRange?.from || day,
                to: dateRange?.to || day,
              });
            }}
            numberOfMonths={2}
            locale={de}
            weekStartsOn={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
