import { DayPicker } from 'react-day-picker';
import { tr } from 'date-fns/locale';
import 'react-day-picker/style.css';

interface CalendarProps {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  appointmentDates: string[];
}

export function Calendar({ selected, onSelect, appointmentDates }: CalendarProps) {
  const hasAppointment = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointmentDates.includes(dateStr);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        locale={tr}
        modifiers={{
          hasAppointment: (date) => hasAppointment(date),
        }}
        modifiersStyles={{
          hasAppointment: {
            backgroundColor: '#dbeafe',
            color: '#1d4ed8',
            fontWeight: 'bold',
          },
        }}
        disabled={{ before: new Date() }}
        className="mx-auto"
      />
      <div className="mt-4 flex items-center gap-4 text-sm text-gray-600 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 rounded"></div>
          <span>Randevulu gün</span>
        </div>
      </div>
    </div>
  );
}
