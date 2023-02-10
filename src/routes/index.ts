import { Router } from 'express'

import isAuthenticated from '../middleware/isAuthenticated.middleware'
import isActive from '../middleware/isActive.middleware'

import createClientController from '../controllers/client/createClient.controller'
import deleteClientController from '../controllers/client/deleteClient.controller'
import retrieveClientController from '../controllers/client/retrieveClient.controller'
import updateClientController from '../controllers/client/updateClient.controller'
import createContactsController from '../controllers/contact/createContact.controller'
import loginController from '../controllers/login/login.controller'
import deleteContactController from '../controllers/contact/deleteContact.controller'
import updateContactController from '../controllers/contact/updateContact.controller'
import listContactController from '../controllers/contact/listContact.controller'
import retrieveContactController from '../controllers/contact/retrieveContact.controller'

const routes = Router()

// Login
routes.post('/login', loginController)

// Client

routes.post('/clients', createClientController)
routes.get('/clients', isAuthenticated, retrieveClientController)
routes.patch('/clients', isAuthenticated, updateClientController)
routes.delete('/clients', isAuthenticated, deleteClientController)

// Contact

routes.post('/contacts', isAuthenticated, isActive, createContactsController)
routes.get('/contacts', isAuthenticated, isActive, listContactController)
routes.get(
  '/contacts/:id',
  isAuthenticated,
  isActive,
  retrieveContactController
)
routes.patch(
  '/contacts/:id',
  isAuthenticated,
  isActive,
  updateContactController
)
routes.delete(
  '/contacts/:id',
  isAuthenticated,
  isActive,
  deleteContactController
)

export default routes
