import { Request, Response, NextFunction } from 'express'

const isActive = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (request.user.isActive == false) {
    return response.status(400).json({ message: 'This client was excluded' })
  }

  next()
}

export default isActive
