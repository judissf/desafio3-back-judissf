import AppDataSource from '../../../data-source'
import { DataSource } from 'typeorm'
import request from 'supertest'
import app from '../../../app'
import { hash } from 'bcryptjs'
import { mockedClient } from '../../mock/client'
import { mockedLogin } from '../../mock/login'

describe('Testes para a rota /clients', () => {
  let connection: DataSource

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then(async (dataSource) => {
        connection = dataSource
        const hashedPassword = await hash('123456', 10)

        await dataSource.query(
          `	INSERT INTO clients (id, name, email, password, phone)
          VALUES 
           ('c98a85d9-9ac2-4736-9e05-1a9f067d6858', 'Jarvis', 'teste@gmail.com', '${hashedPassword}', '11912345678'),
           ('72ce3816-4c61-4de9-9a76-bab31159cbe0', 'Robot', 'testefail@gmail.com', '${hashedPassword}', '11912345678');`
        )

        await dataSource.query(
         `UPDATE clients SET "isActive" = false WHERE name = 'Robot';`
        )
      })
      .catch((error) => console.log(error))
  })

  afterAll(async () => {
    await connection.destroy()
  })

  test('POST /clients - É possível registrar cliente', async () => {
   const response = await request(app).post('/clients').send(mockedClient)

   expect(response.status).toBe(201)
   expect(response.body).toHaveProperty('id')
   expect(response.body).toHaveProperty('name')
   expect(response.body).toHaveProperty('email')
   expect(response.body).toHaveProperty('phone')
   expect(response.body).toHaveProperty('isActive')
   expect(response.body).toHaveProperty('createdAt')
   expect(response.body).toHaveProperty('updatedAt')
  })

  test('GET /clients - É possível listar os dados do perfil do cliente', async () => {
   const login = await request(app).post('/login').send(mockedLogin)
   const response = await request(app).get('/clients').set('Authorization', `Bearer ${login.body.token}`).send()

   expect(response.status).toBe(200)
   expect(response.body).toHaveProperty('id')
   expect(response.body).toHaveProperty('name')
   expect(response.body).toHaveProperty('email')
   expect(response.body).toHaveProperty('phone')
   expect(response.body).toHaveProperty('isActive')
   expect(response.body).toHaveProperty('createdAt')
   expect(response.body).toHaveProperty('updatedAt')
   expect(response.body).toHaveProperty('contacts')
  })

  test('GET /clients - Não é permitido listar dados sem token ou com token inválido', async () => {
   const response = await request(app).get('/clients').send()

   expect(response.status).toBe(401)
   expect(response.body).toHaveProperty('message')
  })

  test('PATCH /clients - É possível atualizar dados do cliente', async () => {
   const login = await request(app).post('/login').send(mockedLogin)
   const response = await request(app).patch('/clients').set('Authorization', `Bearer ${login.body.token}`).send()

   expect(response.status).toBe(200)
   expect(response.body).toHaveProperty('id')
   expect(response.body).toHaveProperty('name')
   expect(response.body).toHaveProperty('email')
   expect(response.body).toHaveProperty('phone')
   expect(response.body).toHaveProperty('isActive')
   expect(response.body).toHaveProperty('createdAt')
   expect(response.body).toHaveProperty('updatedAt')
  })

  test('PATCH /clients - Não é permitido atualizar dados sem token ou com token inválido', async () => {
   const response = await request(app).patch('/clients').send()

   expect(response.status).toBe(401)
   expect(response.body).toHaveProperty('message')
  })

  test('DELETE /clients - É possível desativar a conta do cliente', async () => {
   const login = await request(app).post('/login').send(mockedLogin)
   const response = await request(app).delete('/clients').set('Authorization', `Bearer ${login.body.token}`)
   
   expect(response.status).toBe(204)
   expect(response.body).toEqual({})
  })

  test('DELETE /clients - Não é permitido desativar conta sem token ou com token inválido', async () => {
   const response = await request(app).patch('/clients').send()

   expect(response.status).toBe(401)
   expect(response.body).toHaveProperty('message')
  })
})
