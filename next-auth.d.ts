import { UserType } from '@/types/UserType'

declare module 'next-auth' {
  interface User {
    access_token: string
    access_token_expires: string
    refresh_token: string
    user: UserType
  }
  interface Session {
    error?: 'RefreshTokenError'
    access_token: string
    access_token_expires: string
    refresh_token: string
    user: UserType
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    error?: 'RefreshTokenError'
    access_token: string
    access_token_expires: string
    refresh_token: string
    user: UserType
  }
}
