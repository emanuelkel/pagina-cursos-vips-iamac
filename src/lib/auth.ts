import { cookies } from 'next/headers'

const SESSION_COOKIE = 'iamac_admin_session'
const SESSION_VALUE = 'authenticated'

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)
  return session?.value === SESSION_VALUE
}

export function createSessionCookie(): { name: string; value: string; options: object } {
  return {
    name: SESSION_COOKIE,
    value: SESSION_VALUE,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/',
    },
  }
}

export function clearSessionCookie(): { name: string; value: string; options: object } {
  return {
    name: SESSION_COOKIE,
    value: '',
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    },
  }
}
