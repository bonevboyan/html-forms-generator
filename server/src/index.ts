import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth'
import formsRoutes from './routes/forms'
import { SUPABASE_URL } from './config'

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/forms', formsRoutes)

console.log('hello', SUPABASE_URL)

// Public form access and submission are now under /forms/public/:publicId and /forms/public/:publicId/submit

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})