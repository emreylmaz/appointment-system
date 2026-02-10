import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-secret-key';

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// In-memory storage (demo purposes)
interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
}

interface Appointment {
  id: number;
  userId: number;
  title: string;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

const users: User[] = [
  { id: 1, email: 'admin@demo.com', password: bcrypt.hashSync('admin123', 10), name: 'Admin', role: 'admin' },
  { id: 2, email: 'user@demo.com', password: bcrypt.hashSync('user123', 10), name: 'Demo User', role: 'user' },
];

const appointments: Appointment[] = [
  { id: 1, userId: 2, title: 'Diş Kontrolü', date: '2024-02-15', time: '10:00', duration: 30, status: 'confirmed', createdAt: '2024-02-01' },
  { id: 2, userId: 2, title: 'Saç Kesimi', date: '2024-02-16', time: '14:30', duration: 45, status: 'pending', createdAt: '2024-02-02' },
  { id: 3, userId: 2, title: 'Göz Muayenesi', date: '2024-02-20', time: '09:00', duration: 60, status: 'confirmed', createdAt: '2024-02-03' },
];

let appointmentIdCounter = 4;

// Auth middleware
const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token gerekli' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Geçersiz token' });
  }
};

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Geçersiz kimlik bilgileri' });
  }
  
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Bu email zaten kayıtlı' });
  }
  
  const newUser: User = {
    id: users.length + 1,
    email,
    password: bcrypt.hashSync(password, 10),
    name,
    role: 'user'
  };
  
  users.push(newUser);
  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role } });
});

app.get('/api/auth/me', authMiddleware, (req: any, res) => {
  const user = users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
  res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
});

// Appointment routes
app.get('/api/appointments', authMiddleware, (req: any, res) => {
  const userAppointments = appointments.filter(a => a.userId === req.userId);
  res.json(userAppointments);
});

app.post('/api/appointments', authMiddleware, (req: any, res) => {
  const { title, date, time, duration, notes } = req.body;
  
  const newAppointment: Appointment = {
    id: appointmentIdCounter++,
    userId: req.userId,
    title,
    date,
    time,
    duration: duration || 30,
    status: 'pending',
    notes,
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  appointments.push(newAppointment);
  res.status(201).json(newAppointment);
});

app.put('/api/appointments/:id', authMiddleware, (req: any, res) => {
  const id = parseInt(req.params.id);
  const appointment = appointments.find(a => a.id === id && a.userId === req.userId);
  
  if (!appointment) return res.status(404).json({ error: 'Randevu bulunamadı' });
  
  Object.assign(appointment, req.body);
  res.json(appointment);
});

app.delete('/api/appointments/:id', authMiddleware, (req: any, res) => {
  const id = parseInt(req.params.id);
  const index = appointments.findIndex(a => a.id === id && a.userId === req.userId);
  
  if (index === -1) return res.status(404).json({ error: 'Randevu bulunamadı' });
  
  appointments.splice(index, 1);
  res.json({ message: 'Randevu silindi' });
});

// Available slots
app.get('/api/slots', (req, res) => {
  const { date } = req.query;
  const slots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
  
  const bookedSlots = appointments
    .filter(a => a.date === date && a.status !== 'cancelled')
    .map(a => a.time);
  
  const availableSlots = slots.filter(s => !bookedSlots.includes(s));
  res.json(availableSlots);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
