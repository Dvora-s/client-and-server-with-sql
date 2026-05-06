const cache = {}

export const getCache = (key) => cache[key]
export const setCache = (key, data) => { cache[key] = data }
export const clearCache = (prefix) => {
  Object.keys(cache).forEach(k => { if (k.startsWith(prefix)) delete cache[k] })
}
