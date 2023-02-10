import 'reflect-metadata'
import 'express-async-errors'
import express from 'express'
import routes from './routes'
import cors from 'cors'
import { handleErrorMiddleware } from './middleware/handleError.middleware'

const app = express()

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions))

app.use(express.json())

app.use(routes)

app.use(handleErrorMiddleware)

export default app
