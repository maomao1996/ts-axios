import { isDate, isPlainObject } from './util'

function eccode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any): string {
  if (!params) {
    return url
  }

  const parts: string[] = []

  Object.keys(params).forEach(key => {
    const val = params[key]

    // 空值忽略
    if (val === null || typeof val === 'undefined') {
      // forEach 中的 return 是跳到下一次循环
      return
    }

    // 转成数组统一处理
    let values = []
    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val]
    }
    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${eccode(key)}=${eccode(val)}`)
    })
  })

  let serializedParams = parts.join('&')

  if (serializedParams) {
    // 对哈希处理
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    // 判断是否已经有 ?
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}
