import { CacheValues } from '@/domain'
import { Storage } from '@/infra'
import { injectable } from 'inversify'

@injectable()
export class CookieStorageAdapter implements Storage {
  set<T extends keyof CacheValues>(key: T, value: CacheValues[T]): any {
    const daysToExpire = 15
    const date = new Date()
    date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000)
    const expires = `expires=${date.toUTCString()}`

    document.cookie = `${key}=${encodeURIComponent(JSON.stringify(value))}; path=/; ${expires}`
  }

  get(key: keyof CacheValues) {
    try {
      const name = `${key}=`
      const decodedCookie = decodeURIComponent(document.cookie)
      const cookieArray = decodedCookie.split('; ')

      for (const cookie of cookieArray) {
        if (cookie.indexOf(name) === 0) {
          const cookieValue = cookie.substring(name.length)
          return JSON.parse(cookieValue) 
        }
      }

      return { value: null }
    } catch {
      return { value: null }
    }
  }
}