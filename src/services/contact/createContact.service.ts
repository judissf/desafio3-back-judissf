import AppDataSource from "../../data-source"
import { Client } from "../../entities/client.entity"
import { Contact } from "../../entities/contact.entity"
import { AppError } from "../../errors/appError"
import { IContact } from "../../interfaces"

const createContactService = async ({name, email, phone}: IContact, id: string ) => {
  const clientRepository = AppDataSource.getRepository(Client)

  const findClient = await clientRepository.findOneBy({ id })

  if (!findClient) {
    throw new AppError(404, 'Client not registered')
  }

  if (findClient.isActive == false) {
    throw new AppError(403, 'This client was excluded')
  }

  const contactRepository = AppDataSource.getRepository(Contact)

   const createdContact = contactRepository.create({
    name,
    email,
    phone,
    user: findClient!
   })

  await contactRepository.save(createdContact)

  const {user, ...rest} = createdContact

  return rest
}

export default createContactService
