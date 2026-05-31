export interface User {
  id: string
  email: string
  createdAt: string
}

export interface Session {
  user: User
  accessToken: string
  expiresAt: number
}

export interface AuthError {
  message: string
  code?: string
}
