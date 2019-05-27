import { AxiosRequestConfig, AxiosResponse } from '../types'

export class AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  responst?: AxiosResponse

  constructor(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    responst?: AxiosResponse
  ) {
    super(message)
    this.message = message
    this.config = config
    this.code = code
    this.request = request
    this.responst = responst
    this.isAxiosError = true

    // 解决 TypeScript 继承一些内置对象的时候的坑 (https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work)
    Object.setPrototypeOf(this, AxiosError.prototype)
  }
}

export function createError(
  message: string,
  config: AxiosRequestConfig,
  code?: string | null,
  request?: any,
  responst?: AxiosResponse
): AxiosError {
  const error = new AxiosError(message, config, code, request, responst)

  return error
}
