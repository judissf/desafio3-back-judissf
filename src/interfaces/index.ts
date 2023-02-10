export interface IClientRequest {
  name: string
  email: string
  password: string
  phone: string
}

export interface IClient {
  id: string
  name: string
  email: string
  password: string
  phone: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  contacts?: IContact[]
}

export interface IClientUpdate {
  name?: string
  password?: string
  phone?: string
  contacts?: IContact[] | undefined
}

export interface IContact {
  id: string
  name: string
  email: string
  phone: string
  user: IClient
}

export interface IContactUpdate {
  name?: string
  email?: string
  phone?: string
}

export interface ILogin {
  email: string
  password: string
}
