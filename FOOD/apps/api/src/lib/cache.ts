type CacheEntry<T> = { data: T; expires: number }
const memoryCache = new Map<string, CacheEntry<unknown>>()

export function getCached<T>(key: string): T | null {
  const entry = memoryCache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expires) {
    memoryCache.delete(key)
    return null
  }
  return entry.data as T
}

export function setCached<T>(key: string, data: T, ttlSeconds: number): void {
  if (memoryCache.size > 200) memoryCache.clear()
  memoryCache.set(key, { data, expires: Date.now() + ttlSeconds * 1000 })
}

export function clearMemoryCache(): void {
  memoryCache.clear()
}
