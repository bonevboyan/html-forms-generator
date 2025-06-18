import express, { Request, Response } from 'express'
import { generateForm } from './formGenerator'
import { Schema } from './types'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/generate-form', (req: Request, res: Response) => {
  try {
    const schema: Schema = req.body
    const html = generateForm(schema)
    res.send(html)
  } catch (error) {
    res.status(400).json({ error: 'Invalid schema format' })
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})