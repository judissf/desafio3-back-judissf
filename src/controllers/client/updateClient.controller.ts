import { Request, Response } from 'express'
import updateClientService from '../../services/client/updateClient.service'
import { instanceToPlain } from 'class-transformer'

const updateClientController = async (request: Request, response: Response) => {
  const data = request.body

  const id = request.user.id

  const updatedClient = await updateClientService(data, id)

  return response.status(200).json(instanceToPlain(updatedClient))
}

export default updateClientController
