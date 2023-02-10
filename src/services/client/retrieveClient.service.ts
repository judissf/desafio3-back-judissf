import AppDataSource from "../../data-source"
import { Client } from "../../entities/client.entity"
import { AppError } from "../../errors/appError"

const retrieveClientService = async (id: string) => {
  const clientRepository = AppDataSource.getRepository(Client)

  const client = await clientRepository.findOneBy({id})

  if (!client) {
    throw new AppError(404, 'Client not registered')
  }

  return client
}

export default retrieveClientService
