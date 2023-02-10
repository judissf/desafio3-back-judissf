import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const isAuthenticated = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  let token = request.headers.authorization

  if (!token) {
    return response.status(401).json({
      message: 'Unauthorized | Missing token',
    })
  }

  token = token.split(' ')[1]

  jwt.verify(token, process.env.SECRET_KEY as string, (error, decoded: any) => {
    if (error) {
      return response.status(401).json({
        message: 'Invalid token | Token expired',
      })
    }

    request.user = {
      isActive: decoded.isActive,
      id: decoded.sub
    }

    next()

  })
}

export default isAuthenticated
