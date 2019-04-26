import { AxiosRequestConfig } from './types'

export default function xhr(config: AxiosRequestConfig): void {
  const { url, method = 'GET', data = null, headers } = config

  const request = new XMLHttpRequest()

  request.open(method.toUpperCase(), url, true)

  Object.keys(headers).forEach(name => {
    // data 为空时删除 content-type
    if (data === null && name.toLowerCase() === 'content-type') {
      delete headers[name]
    } else {
      request.setRequestHeader(name, headers[name])
    }
  })

  request.send(data)
}
