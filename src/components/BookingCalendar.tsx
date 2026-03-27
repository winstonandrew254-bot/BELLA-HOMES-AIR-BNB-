import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  isBefore, 
  isAfter,
  startOfToday,
  eachDayOfInterval,
  isWithinInterval
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface BookingCalendarProps {
  checkIn: Date | null;
  checkOut: Date | null;
  onSelectDates: (checkIn: Date | null, checkOut: Date | null) => void;
  bookedDates?: Date[];
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({ 
  checkIn, 
  checkOut, 
  onSelectDates,
  bookedDates = [] 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfToday();

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-dark">
          {format(currentMonth, 'MMMM yyyy')}
        </h4>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
            disabled={isSameMonth(currentMonth, today)}
          >
            <ChevronLeft size={20} className={isSameMonth(currentMonth, today) ? 'text-neutral-300' : 'text-dark'} />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <ChevronRight size={20} className="text-dark" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center text-xs font-bold text-neutral-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isSelected = (checkIn && isSameDay(day, checkIn)) || (checkOut && isSameDay(day, checkOut));
        const isInRange = checkIn && checkOut && isWithinInterval(day, { start: checkIn, end: checkOut });
        const isBooked = bookedDates.some(d => isSameDay(d, day));
        const isPast = isBefore(day, today);
        const isDisabled = isPast || isBooked;

        days.push(
          <div
            key={day.toString()}
            className={`
              relative h-10 flex items-center justify-center cursor-pointer text-sm font-medium transition-all
              ${!isSameMonth(day, monthStart) ? 'text-neutral-300' : 'text-dark'}
              ${isSelected ? 'bg-gold text-white rounded-full z-10' : ''}
              ${isInRange && !isSelected ? 'bg-gold/10 text-gold' : ''}
              ${isDisabled ? 'text-neutral-300 cursor-not-allowed' : 'hover:bg-neutral-100 rounded-full'}
              ${isBooked ? 'line-through' : ''}
            `}
            onClick={() => !isDisabled && onDateClick(cloneDay)}
          >
            <span>{format(day, 'd')}</span>
            {isBooked && (
              <div className="absolute bottom-1 w-1 h-1 bg-red-400 rounded-full"></div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="calendar-body">{rows}</div>;
  };

  const onDateClick = (day: Date) => {
    if (!checkIn || (checkIn && checkOut)) {
      onSelectDates(day, null);
    } else if (isBefore(day, checkIn)) {
      onSelectDates(day, null);
    } else if (isSameDay(day, checkIn)) {
      onSelectDates(null, null);
    } else {
      onSelectDates(checkIn, day);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
      <div className="flex items-center gap-2 mb-6 text-gold">
        <CalendarIcon size={20} />
        <span className="font-bold uppercase tracking-widest text-xs">Select Dates</span>
      </div>
      
      {renderHeader()}
      {renderDays()}
      {renderCells()}

      <div className="mt-6 pt-6 border-t border-neutral-100 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] text-neutral-400 uppercase font-bold mb-1">Check-in</p>
          <p className="text-sm font-bold">{checkIn ? format(checkIn, 'MMM dd, yyyy') : 'Select date'}</p>
        </div>
        <div>
          <p className="text-[10px] text-neutral-400 uppercase font-bold mb-1">Check-out</p>
          <p className="text-sm font-bold">{checkOut ? format(checkOut, 'MMM dd, yyyy') : 'Select date'}</p>
        </div>
      </div>
    </div>
  );
};
