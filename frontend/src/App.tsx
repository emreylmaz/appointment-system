import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Calendar } from './components/Calendar';
import { AppointmentList } from './components/AppointmentList';
import { NewAppointmentModal } from './components/NewAppointmentModal';
import { auth, appointments as appointmentsApi } from './api';
import type { User, Appointment } from './api';
import { CalendarPlus, LogOut, User as UserIcon } from 'lucide-react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      auth.me()
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadAppointments();
    }
  }, [user]);

  const loadAppointments = async () => {
    try {
      const res = await appointmentsApi.list();
      setAppointments(res.data);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    }
  };

  const handleLogin = (user: User) => {
    setUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setAppointments([]);
  };

  const handleCreateAppointment = async (data: Parameters<typeof appointmentsApi.create>[0]) => {
    try {
      await appointmentsApi.create(data);
      await loadAppointments();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to create appointment:', err);
    }
  };

  const handleDeleteAppointment = async (id: number) => {
    if (!confirm('Bu randevuyu silmek istediğinize emin misiniz?')) return;
    try {
      await appointmentsApi.delete(id);
      await loadAppointments();
    } catch (err) {
      console.error('Failed to delete appointment:', err);
    }
  };

  const handleStatusChange = async (id: number, status: Appointment['status']) => {
    try {
      await appointmentsApi.update(id, { status });
      await loadAppointments();
    } catch (err) {
      console.error('Failed to update appointment:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const appointmentDates = appointments.map(a => a.date);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">📅 Randevu Sistemi</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <UserIcon size={20} />
              <span>{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} />
              Çıkış
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <Calendar
              selected={selectedDate}
              onSelect={setSelectedDate}
              appointmentDates={appointmentDates}
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <CalendarPlus size={20} />
              Yeni Randevu Oluştur
            </button>
          </div>

          {/* Appointments */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Randevularım ({appointments.length})
            </h2>
            <AppointmentList
              appointments={appointments}
              onDelete={handleDeleteAppointment}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      </main>

      {/* New Appointment Modal */}
      <NewAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateAppointment}
        selectedDate={selectedDate}
      />
    </div>
  );
}

export default App;
