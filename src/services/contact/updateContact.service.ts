import AppDataSource from '../../data-source'
import { Client } from '../../entities/client.entity'
import { Contact } from '../../entities/contact.entity'
import { AppError } from '../../errors/appError'
import { IContactUpdate } from '../../interfaces'

const updateContactService = async (
  data: IContactUpdate,
  client_id: string,
  id: string
) => {
  const contactRepository = AppDataSource.getRepository(Contact)

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

  await contactRepository.update(id, {
    name: data.name ? data.name : findContact!.name,
    email: data.email ? data.email : findContact!.email,
    phone: data.phone ? data.phone : findContact!.phone,
  })

  const contact = await contactRepository.findOneBy({ id })

  return contact
}

export default updateContactService
