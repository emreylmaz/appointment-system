import express from 'express'
import cors from 'cors'
import { authRouter } from './routes/auth'
import { appointmentRouter } from './routes/appointments'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/auth', authRouter)
app.use('/api/appointments', appointmentRouter)

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Bir şeyler ters gitti!' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
