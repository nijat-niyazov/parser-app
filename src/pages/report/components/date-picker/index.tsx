import { format, subMonths } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn, formatDate } from '@/utils';
import { CalendarDays } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const currentDate = new Date();

function DatePickerWithRange({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const from = searchParams.has('fromDate') ? new Date(searchParams.get('fromDate') as string) : subMonths(currentDate, 1);
  const to = searchParams.has('toDate') ? new Date(searchParams.get('toDate') as string) : currentDate;

  const [date, setDate] = useState<DateRange | undefined>({ from, to });

  function changeDate(newDate: DateRange | undefined) {
    setDate(newDate);

    if (newDate?.from) {
      searchParams.set('fromDate', formatDate(newDate.from));
    }
    if (newDate?.to) {
      searchParams.set('toDate', formatDate(newDate.to));
    }

    setSearchParams(searchParams);
  }

  return (
    <div className={cn('grid gap-2 mr-auto', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn('w-64 justify-start text-left font-normal', !date && 'text-muted-foreground')}
          >
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarDays className="mr-2 h-4 w-4 ml-auto" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={changeDate} numberOfMonths={2} />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DatePickerWithRange;
