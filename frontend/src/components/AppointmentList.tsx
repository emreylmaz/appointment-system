import type { Appointment } from '../api';
import { Calendar, Clock, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

interface AppointmentListProps {
  appointments: Appointment[];
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: Appointment['status']) => void;
}

export function AppointmentList({ appointments, onDelete, onStatusChange }: AppointmentListProps) {
  const getStatusBadge = (status: Appointment['status']) => {
    const config = {
      pending: { icon: AlertCircle, bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Beklemede' },
      confirmed: { icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-700', label: 'Onaylandı' },
      cancelled: { icon: XCircle, bg: 'bg-red-100', text: 'text-red-700', label: 'İptal' },
    };
    const { icon: Icon, bg, text, label } = config[status];
    return (
      <span className={`${bg} ${text} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
        <Icon size={14} />
        {label}
      </span>
    );
  };

  const sortedAppointments = [...appointments].sort((a, b) => 
    new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime()
  );

  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Henüz randevunuz bulunmuyor</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedAppointments.map((appointment) => (
        <div key={appointment.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-800">{appointment.title}</h3>
              <div className="flex items-center gap-4 mt-2 text-gray-600 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  {format(parseISO(appointment.date), 'd MMMM yyyy, EEEE', { locale: tr })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {appointment.time} ({appointment.duration} dk)
                </span>
              </div>
              {appointment.notes && (
                <p className="mt-2 text-gray-500 text-sm">{appointment.notes}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(appointment.status)}
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            {appointment.status === 'pending' && (
              <>
                <button
                  onClick={() => onStatusChange(appointment.id, 'confirmed')}
                  className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                >
                  Onayla
                </button>
                <button
                  onClick={() => onStatusChange(appointment.id, 'cancelled')}
                  className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  İptal Et
                </button>
              </>
            )}
            <button
              onClick={() => onDelete(appointment.id)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
