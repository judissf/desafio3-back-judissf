import AppDataSource from "../../data-source"
import { Client } from "../../entities/client.entity"
import { Contact } from "../../entities/contact.entity"
import { AppError } from "../../errors/appError"

const retrieveContactService = async (client_id: string, id: string) => {
  const clientRepository = AppDataSource.getRepository(Client)

  const findClient = await clientRepository.findOneBy({ id: client_id })

  const findContact = await AppDataSource.getRepository(Contact)
    .createQueryBuilder('contact')
    .where('contact.id = :id', { id })
    .getOne()

  const search = findClient?.contacts.findIndex((result) => result.id == id)

  if (search! < 0) {
    throw new AppError(403, 'You do not have permission to access this contact')
  }

  return findContact
}

export default retrieveContactService