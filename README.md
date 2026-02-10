# 📅 Appointment System

Full-stack randevu/rezervasyon sistemi. React + Node.js ile geliştirildi.

![Preview](./preview.png)

## 🚀 Özellikler

- **Kullanıcı Yönetimi** - Kayıt, giriş, JWT authentication
- **Takvim Görünümü** - Randevulu günleri görüntüleme
- **Randevu Oluşturma** - Tarih, saat, süre seçimi
- **Durum Yönetimi** - Beklemede, onaylandı, iptal
- **Müsait Saatler** - Doluluk kontrolü
- **Responsive Tasarım** - Mobil uyumlu

## 🛠️ Teknolojiler

### Frontend
- **React 18** + TypeScript
- **TailwindCSS** - Styling
- **React Day Picker** - Takvim
- **Axios** - HTTP client
- **Lucide React** - İkonlar

### Backend
- **Node.js** + Express
- **TypeScript**
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📦 Kurulum

### Backend

```bash
cd backend
npm install
npm run dev
```

Server `http://localhost:3001` adresinde çalışacak.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Uygulama `http://localhost:5173` adresinde açılacak.

## 🔑 Demo Hesapları

| Email | Şifre | Rol |
|-------|-------|-----|
| user@demo.com | user123 | Kullanıcı |
| admin@demo.com | admin123 | Admin |

## 📁 Proje Yapısı

```
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Login.tsx
│       │   ├── Calendar.tsx
│       │   ├── AppointmentList.tsx
│       │   └── NewAppointmentModal.tsx
│       ├── api.ts
│       └── App.tsx
├── backend/
│   └── src/
│       └── index.ts
└── README.md
```

## 📝 API Endpoints

### Auth
- `POST /api/auth/login` - Giriş
- `POST /api/auth/register` - Kayıt
- `GET /api/auth/me` - Kullanıcı bilgisi

### Appointments
- `GET /api/appointments` - Randevuları listele
- `POST /api/appointments` - Yeni randevu
- `PUT /api/appointments/:id` - Randevu güncelle
- `DELETE /api/appointments/:id` - Randevu sil

### Slots
- `GET /api/slots?date=YYYY-MM-DD` - Müsait saatler

## 🎨 Ekran Görüntüleri

### Giriş Ekranı
- Modern login formu
- Demo hesap bilgileri

### Ana Sayfa
- Interaktif takvim
- Randevu listesi
- Durum badge'leri

## 📝 Lisans

MIT

---

**Geliştirici:** [Emre Yılmaz](https://github.com/emreylmaz)
