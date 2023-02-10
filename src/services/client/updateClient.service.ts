import { hash } from 'bcrypt'
import AppDataSource from '../../data-source'
import { Client } from '../../entities/client.entity'
import { AppError } from '../../errors/appError'
import { IClientUpdate } from '../../interfaces'

const updateClientService = async (
  data: IClientUpdate,
  id: string
): Promise<Client> => {
  const verifyData = Object.keys(data)

  const clientRepository = AppDataSource.getRepository(Client)

  const findClientById = await clientRepository.findOneBy({ id })

  if (!findClientById) {
    throw new AppError(404, 'Client not registered')
  }

  if (verifyData.includes('email')) {
    throw new AppError(403, 'Unauthorized')
  }

  if (verifyData.includes('isActive')) {
    throw new AppError(403, 'Unauthorized')
  }

  await clientRepository.update(id, {
    name: data.name ? data.name : findClientById.name,
    password: data.password
      ? await hash(data.password, 10)
      : findClientById.password,
    phone: data.phone ? data.phone : findClientById.phone
  })

  const client = await clientRepository.findOneBy({ id })

  return client!
}

export default updateClientService
