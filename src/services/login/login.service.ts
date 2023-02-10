import { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import AppDataSource from '../../data-source'
import { Client } from '../../entities/client.entity'
import { AppError } from '../../errors/appError'
import { ILogin } from '../../interfaces'

const loginService = async ({ email, password }: ILogin): Promise<string> => {
  const clientRepository = AppDataSource.getRepository(Client)

  const client = await clientRepository.findOneBy({ email: email })

  if (!client) {
    throw new AppError(404, 'Client not registered')
  }

  if (client.isActive == false) {
    throw new AppError(403, 'This client was excluded')
  }

  const passwordMatch = await compare(password, client.password)

  if (!passwordMatch) {
    throw new AppError(403, 'Wrong e-mail or password')
  }

  const token = jwt.sign({}, process.env.SECRET_KEY as string, {
    expiresIn: '24h',
    subject: client.id,
  })

  return token
}

export default loginService
