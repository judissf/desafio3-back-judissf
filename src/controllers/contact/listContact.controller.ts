import { Request, Response } from 'express'
import listContactService from '../../services/contact/listContact.service'

const listContactController = async (request: Request, response: Response) => {
  const id = request.user.id

  const contacts = await listContactService(id)

  return response.status(200).json(contacts)
}

export default listContactController
