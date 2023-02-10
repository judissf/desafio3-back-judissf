import { Request, Response } from 'express'
import { AppError } from '../../errors/appError'
import deleteContactService from '../../services/contact/deleteContact.service'

const deleteContactController = async (
  request: Request,
  response: Response
) => {
  try {
    const { id } = request.params

    const client_id = request.user.id

    const contactDeleted = await deleteContactService(client_id, id)

    return response.status(204).json({ message: contactDeleted })
  } catch (error) {
    if (error instanceof AppError) {
      return response
        .status(400)
        .json({ error: error.name, message: error.message })
    }
  }
}

export default deleteContactController
