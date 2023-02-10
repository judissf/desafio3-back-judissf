import AppDataSource from '../../../data-source'
import { DataSource } from 'typeorm'
import request from 'supertest'
import app from '../../../app'
import { hash } from 'bcryptjs'
import { mockedLogin, mockedLoginFail } from '../../mock/login'

describe('Testes para a rota /login', () => {
  let connection: DataSource

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then(async (dataSource) => {
        connection = dataSource
        const hashedPassword = await hash('123456', 10)

        await dataSource.query(
          `INSERT INTO clients (id, name, email, password, phone)
            VALUES 
          ('c98a85d9-9ac2-4736-9e05-1a9f067d6858', 'Jarvis', 'teste@gmail.com', '${hashedPassword}', '11912345678'),
          ('aab35c47-526f-4fec-8605-a700a820b82c', 'David', 'teste2@gmail.com', '${hashedPassword}', '11910045678'),
          ('72ce3816-4c61-4de9-9a76-bab31159cbe0', 'Robot', 'isnotactive@gmail.com', '${hashedPassword}', '11912115678');`
        )

        await dataSource.query(
          `UPDATE clients SET "isActive" = false WHERE email = 'isnotactive@gmail.com';`
        )

      })
      .catch((error) => console.log(error))
  })

  afterAll(async () => {
    await connection.destroy()
  })

  test('POST /login - É possível fazer login', async () => {
   const response = await request(app).post('/login').send(mockedLogin)
   
   expect(response.status).toBe(200)
   expect(response.body).toHaveProperty('token')
  })

  test('POST /login - Não é permitido fazer login com conta desativada', async () => {
   const response = await request(app).post('/login').send(mockedLoginFail)
   
   expect(response.status).toBe(403)
   expect(response.body).toHaveProperty('message')
  })
})
