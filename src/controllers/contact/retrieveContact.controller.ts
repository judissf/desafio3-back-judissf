import { Request, Response } from 'express'
import { AppError } from '../../errors/appError'
import retrieveContactService from '../../services/contact/retrieveContact.service'

const retrieveContactController = async (
  request: Request,
  response: Response
) => {
  try {
    const { id } = request.params

    const client_id = request.user.id

    const contact = await retrieveContactService(client_id, id)

    return response.status(200).json(contact)
  } catch (error) {
    if (error instanceof AppError) {
      return response
        .status(400)
        .json({ error: error.name, message: error.message })
    }
  }
}

export default retrieveContactController
