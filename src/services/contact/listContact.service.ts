import AppDataSource from '../../data-source'
import { Client } from '../../entities/client.entity'
import { Contact } from '../../entities/contact.entity'
import { AppError } from '../../errors/appError'

const listContactService = async (id: string) => {
  const contactRepository = AppDataSource.getRepository(Contact)

  const clientRepository = AppDataSource.getRepository(Client)

  const findClient = await clientRepository.findOneBy({ id })

  if (!findClient) {
    throw new AppError(404, 'Client not registered')
  }

  const contacts = await contactRepository.find({
    where: {
      user: {
        id: findClient.id,
      },
    },
  })

  return contacts
}

export default listContactService
