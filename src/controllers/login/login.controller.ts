import { Request, Response } from "express";
import loginService from "../../services/login/login.service";

const loginController = async (request: Request, response: Response) => {
 const data = request.body

 const token = await loginService(data)

 return response.status(200).json({ token: token })
}

export default loginController