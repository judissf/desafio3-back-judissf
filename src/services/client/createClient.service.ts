import { hashSync } from "bcrypt"
import AppDataSource from "../../data-source"
import { Client } from "../../entities/client.entity"
import { AppError } from "../../errors/appError"
import { IClientRequest } from "../../interfaces"

const createClientService = async ({
  name,
  email,
  password,
  phone,
}: IClientRequest) => {
  const clientRepository = AppDataSource.getRepository(Client)

  const findClient = await clientRepository.findOneBy({ email: email })

  if (findClient) {
    throw new AppError(400, 'This e-mail is already in use')
  }

  if (!password) {
    throw new AppError(400, 'Password is missing')
  }

  const hashedPassword = hashSync(password, 10)

  const client = clientRepository.create({
    name,
    email,
    password: 
    hashedPassword,
    phone,
    isActive: true,
  })

  await clientRepository.save(client)

  return client
  
}

export default createClientService
