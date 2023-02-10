import { Request, Response } from 'express'
import { AppError } from '../../errors/appError'
import updateContactService from '../../services/contact/updateContact.service'

const updateContactController = async (
  request: Request,
  response: Response
) => {
  try {
    const data = request.body

    const client_id = request.user.id

    const { id } = request.params

    const contactUpdated = await updateContactService(data, client_id, id)

    return response.status(200).json(contactUpdated)
  } catch (error) {
    if (error instanceof AppError) {
      return response
        .status(400)
        .json({ error: error.name, message: error.message })
    }
  }
}

export default updateContactController
