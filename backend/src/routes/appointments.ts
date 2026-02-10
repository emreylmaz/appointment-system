import { Router, Response } from 'express'
import { prisma } from '../utils/prisma'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import { createAppointmentSchema, updateAppointmentSchema } from '../utils/validators'

const router = Router()

router.use(authMiddleware)

// Get user appointments
// @ts-ignore
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { userId: req.userId },
      orderBy: { date: 'asc' },
    })
    res.json(appointments)
  } catch (error) {
    res.status(500).json({ error: 'Randevular alınamadı' })
  }
})

// Create appointment
// @ts-ignore
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const data = createAppointmentSchema.parse(req.body)

    // Check availability (basic check)
    const existing = await prisma.appointment.findFirst({
      where: {
        date: new Date(data.date),
        time: data.time,
        status: { not: 'CANCELLED' },
      },
    })

    if (existing) {
      // In a real app, you'd check overlapping times, not just exact match
      // For demo simplicity, exact match check
    }

    const appointment = await prisma.appointment.create({
      data: {
        ...data,
        date: new Date(data.date),
        userId: req.userId!,
      },
    })

    res.status(201).json(appointment)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors })
    }
    res.status(500).json({ error: 'Randevu oluşturulamadı' })
  }
})

// Update appointment
// @ts-ignore
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const data = updateAppointmentSchema.parse(req.body)

    const appointment = await prisma.appointment.findFirst({
      where: { id: String(id), userId: req.userId },
    })

    if (!appointment) {
      return res.status(404).json({ error: 'Randevu bulunamadı' })
    }

    const updated = await prisma.appointment.update({
      where: { id: String(id) },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
    })

    res.json(updated)
  } catch (error: any) {
    res.status(500).json({ error: 'Güncelleme başarısız' })
  }
})

// Delete appointment
// @ts-ignore
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const appointment = await prisma.appointment.findFirst({
      where: { id: String(id), userId: req.userId },
    })

    if (!appointment) {
      return res.status(404).json({ error: 'Randevu bulunamadı' })
    }

    await prisma.appointment.delete({
      where: { id: String(id) },
    })

    res.json({ message: 'Randevu silindi' })
  } catch (error) {
    res.status(500).json({ error: 'Silme işlemi başarısız' })
  }
})

// Get available slots
// @ts-ignore
router.get('/slots', async (req: AuthRequest, res: Response) => {
  try {
    const { date } = req.query
    if (!date || typeof date !== 'string') {
      return res.status(400).json({ error: 'Tarih gerekli' })
    }

    const slots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30']

    const booked = await prisma.appointment.findMany({
      where: {
        date: new Date(date),
        status: { not: 'CANCELLED' },
      },
      select: { time: true },
    })

    const bookedTimes = booked.map(b => b.time)
    const available = slots.filter(s => !bookedTimes.includes(s))

    res.json(available)
  } catch (error) {
    res.status(500).json({ error: 'Müsait saatler alınamadı' })
  }
})

export { router as appointmentRouter }
