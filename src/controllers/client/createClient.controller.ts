import { Request, Response } from 'express'
import { instanceToPlain } from 'class-transformer'
import createClientService from '../../services/client/createClient.service'
import { AppError } from '../../errors/appError'

const createClientController = async (request: Request, response: Response) => {
  try {
    const client = request.body

    const clientCreated = await createClientService(client)

    return response.status(201).json(instanceToPlain(clientCreated))
  } catch (error) {
    if (error instanceof AppError) {
      return response
        .status(400)
        .json({ error: error.name, message: error.message })
    }
  }
}

export default createClientController
