import AppDataSource from '../../../data-source'
import { DataSource } from 'typeorm'
import request from 'supertest'
import app from '../../../app'
import { hash } from 'bcryptjs'
import { mockedLogin, mockedLoginFail, mockedLoginTwo } from '../../mock/login'
import {
  mockedContact,
  mockedContactUpdate,
} from '../../mock/contact'

describe('Testes para a rota /contacts', () => {
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

        await dataSource.query(
          `INSERT INTO contacts (id, name, email, phone, userId) 
            VALUES 
          ('22711eba-c4e5-43c8-8285-9fddda70fba0', 'Contact 1', 'contactone@gmail.com', '11911111111', 'c98a85d9-9ac2-4736-9e05-1a9f067d6858'),
          ('4ca35cd7-6468-407f-9e50-df6c81e4d814', 'Contact 2', 'contacttwo@gmail.com', '11911112111', 'aab35c47-526f-4fec-8605-a700a820b82c');`
        )
      })
      .catch((error) => console.log(error))
  })

  afterAll(async () => {
    await connection.destroy()
  })

  test('POST /contacts - É possível criar um contato atrelado a um cliente (Autenticação necessária)', async () => {
    const login = await request(app).post('/login').send(mockedLogin)
    const response = await request(app)
      .post('/contacts')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send(mockedContact)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('name')
    expect(response.body).toHaveProperty('email')
    expect(response.body).toHaveProperty('phone')
    expect(response.body).toHaveProperty('createdAt')
    expect(response.body).toHaveProperty('updatedAt')
  })

  test('POST /contacts - Não é permitido criar um contato sem autenticação', async () => {
    const response = await request(app).post('/contacts').send(mockedContact)

    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty('message')
  })

  test('POST /contacts - Não é permitido criar um contato para um cliente desativado (Autenticação necessária)', async () => {
    const login = await request(app).post('/login').send(mockedLoginFail)
    const response = await request(app)
      .post('/contacts')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send(mockedContact)

    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty('message')
  })

  test('GET /contacts - É possível listar todos os contatos do cliente (Autenticação necessária)', async () => {
    const login = await request(app).post('/login').send(mockedLogin)
    const response = await request(app)
      .get('/contacts')
      .set('Authorization', `Bearer ${login.body.token}`)

    expect(response.status).toBe(200)
  })

  test('GET /contacts - Não é permitido listar contatos sem autenticação', async () => {
    const response = await request(app).get('/contacts')

    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty('message')
  })

  test('GET /contacts - Não é permitido listar contatos de um cliente desativado (Autenticação necessária)', async () => {
    const login = await request(app).post('/login').send(mockedLoginFail)
    const response = await request(app)
      .get('/contacts')
      .set('Authorization', `Bearer ${login.body.token}`)

    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty('message')
  })

  test('GET /contacts/:id - É possível listar contato por id (Autenticação necessária)', async () => {
    const login = await request(app).post('/login').send(mockedLogin)
    const allContacts = await request(app)
      .get('/contacts')
      .set('Authorization', `Bearer ${login.body.token}`)
    const id = allContacts.body[0].id
    const response = await request(app)
      .get(`/contacts/${id}`)
      .set('Authorization', `Bearer ${login.body.token}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('name')
    expect(response.body).toHaveProperty('email')
    expect(response.body).toHaveProperty('phone')
    expect(response.body).toHaveProperty('createdAt')
    expect(response.body).toHaveProperty('updatedAt')
  })

  test('GET /contacts/:id - Não é permitido listar contato que seja de outro cliente (Autenticação necessária)', async () => {
    const login = await request(app).post('/login').send(mockedLogin)
    const loginTwo = await request(app).post('/login').send(mockedLoginTwo)
    const allContacts = await request(app)
      .get('/contacts')
      .set('Authorization', `Bearer ${login.body.token}`)
    const id = allContacts.body[0].id
    const response = await request(app)
      .get(`/contacts/${id}`)
      .set('Authorization', `Bearer ${loginTwo.body.token}`)

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message')
  })

  test('PATCH /contacts/:id - É possível atualizar os dados de um contato (Autenticação necessária)', async () => {
    const login = await request(app).post('/login').send(mockedLogin)
    const findContact = await request(app)
      .get('/contacts')
      .set('Authorization', `Bearer ${login.body.token}`)
    const id = findContact.body[0].id
    const response = await request(app)
      .patch(`/contacts/${id}`)
      .set('Authorization', `Bearer ${login.body.token}`)
      .send(mockedContactUpdate)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('name')
    expect(response.body).toHaveProperty('phone')
  })

  test('PATCH /contacts/:id - Não é possível atualizar os dados de um contato de outro cliente (Autenticação necessária)' , async () => {
    const login = await request(app).post('/login').send(mockedLogin)
    const loginTwo = await request(app).post('/login').send(mockedLoginTwo)
    const allContacts = await request(app)
      .get('/contacts')
      .set('Authorization', `Bearer ${login.body.token}`)
    const id = allContacts.body[0].id
    const response = await request(app)
      .patch(`/contacts/${id}`)
      .set('Authorization', `Bearer ${loginTwo.body.token}`)
      .send(mockedContactUpdate)

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message')
  })

  test('DELETE /contacts/:id - É possível excluir contato por id (Autenticação necessária)', async () => {
    const login = await request(app).post('/login').send(mockedLogin)
    const allContacts = await request(app)
      .get('/contacts')
      .set('Authorization', `Bearer ${login.body.token}`)
    const id = allContacts.body[0].id
    const response = await request(app)
      .delete(`/contacts/${id}`)
      .set('Authorization', `Bearer ${login.body.token}`)

    expect(response.status).toBe(204)
  })

  test('DELETE /contacts/:id - Não é permitido excluir contato de outro cliente (Autenticação necessária)', async () => {
    const login = await request(app).post('/login').send(mockedLogin)
    const loginTwo = await request(app).post('/login').send(mockedLoginTwo)
    const allContacts = await request(app)
      .get('/contacts')
      .set('Authorization', `Bearer ${login.body.token}`)
    const id = allContacts.body[0].id
    const response = await request(app)
      .delete(`/contacts/${id}`)
      .set('Authorization', `Bearer ${loginTwo.body.token}`)

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message')
  })

  test('DELETE /contacts/:id - Não é possível excluir contato inválido (Autenticação necessária)', async () => {
    const login = await request(app).post('/login').send(mockedLogin)
    const loginTwo = await request(app).post('/login').send(mockedLoginTwo)
    const response = await request(app)
      .delete(`/contacts/aab35c47-526f-4fec-8605-a700a820b82c`)
      .set('Authorization', `Bearer ${loginTwo.body.token}`)

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message')
  })
})
