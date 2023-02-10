import { Request, Response } from 'express'
import { instanceToPlain } from 'class-transformer'
import retrieveClientService from '../../services/client/retrieveClient.service'

const retrieveClientController = async (request: Request, response: Response) => {
 const id = request.user.id
 
 const client = await retrieveClientService(id)

 return response.status(200).json(instanceToPlain(client))
}

export default retrieveClientController