import { Request, Response } from "express"
import { AppError } from "../../errors/appError"
import deleteClientService from "../../services/client/deleteClient.service"


const deleteClientController = async (request: Request, response: Response) => {
 try {
  const id = request.user.id

  const clientDeleted = await deleteClientService(id)

  return response.status(204).json({ message: clientDeleted })
 } catch (error) {
  if (error instanceof AppError) {
   return response.status(400).json({ error: error.name, message: error.message })
  }
 }

}

export default deleteClientController