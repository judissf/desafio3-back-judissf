import { Request, Response } from 'express'
import { instanceToPlain } from 'class-transformer'
import createContactService from '../../services/contact/createContact.service'
import { AppError } from '../../errors/appError'

const createContactController = async (
  request: Request,
  response: Response
) => {
  try {
    const contact = request.body

    const id = request.user.id

    const contactCreated = await createContactService(contact, id)

    return response.status(201).json(instanceToPlain(contactCreated))
  } catch (error) {
    if (error instanceof AppError) {
      return response
        .status(400)
        .json({ error: error.name, message: error.message })
    }
  }
}

export default createContactController
