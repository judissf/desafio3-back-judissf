import AppDataSource from "../../data-source"
import { Client } from "../../entities/client.entity"
import { AppError } from "../../errors/appError"

const deleteClientService = async (id: string) => {
  const clientRepository = AppDataSource.getRepository(Client)

  const findClient = await clientRepository.findOneBy({ id })

  if (!findClient) {
    throw new AppError(404, 'Client not registered')
  }

  if (findClient.isActive === false) {
    throw new AppError(400, 'This client is already deactivated')
  }

  await clientRepository.update(id, {
    isActive: false,
  })

  return 'Client deleted'
}

export default deleteClientService
