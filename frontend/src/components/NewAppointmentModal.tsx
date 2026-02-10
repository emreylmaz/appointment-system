import { useState, useEffect } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { slots } from '../api';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; date: string; time: string; duration: number; notes?: string }) => void;
  selectedDate: Date | undefined;
}

export function NewAppointmentModal({ isOpen, onClose, onSubmit, selectedDate }: NewAppointmentModalProps) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDate && isOpen) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      slots.available(dateStr).then(res => {
        setAvailableSlots(res.data);
        if (res.data.length > 0) setTime(res.data[0]);
      });
    }
  }, [selectedDate, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !time) return;
    
    setLoading(true);
    onSubmit({
      title,
      date: selectedDate.toISOString().split('T')[0],
      time,
      duration,
      notes: notes || undefined,
    });
    
    // Reset form
    setTitle('');
    setTime('');
    setDuration(30);
    setNotes('');
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Yeni Randevu</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {selectedDate && (
            <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3">
              <Calendar className="text-blue-600" size={24} />
              <div>
                <p className="text-sm text-blue-600">Seçilen Tarih</p>
                <p className="font-semibold text-blue-800">
                  {format(selectedDate, 'd MMMM yyyy, EEEE', { locale: tr })}
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Randevu Başlığı</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Örn: Diş Kontrolü"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Saat</label>
            <div className="grid grid-cols-4 gap-2">
              {availableSlots.length > 0 ? (
                availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      time === slot
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {slot}
                  </button>
                ))
              ) : (
                <p className="col-span-4 text-gray-500 text-sm text-center py-4">
                  Bu tarihte müsait saat bulunmuyor
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Süre</label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={15}>15 dakika</option>
              <option value={30}>30 dakika</option>
              <option value={45}>45 dakika</option>
              <option value={60}>1 saat</option>
              <option value={90}>1.5 saat</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notlar (Opsiyonel)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Eklemek istediğiniz notlar..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading || !time || availableSlots.length === 0}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Clock size={18} />
              Randevu Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
