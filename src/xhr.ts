import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { parseHeaders } from './helpers/headers'

// 发送 ajax 请求
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  // promise 化
  return new Promise(resolve => {
    const { url, method = 'GET', data = null, headers, responseType } = config

    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    request.open(method.toUpperCase(), url, true)

    request.onreadystatechange = function handleLoad() {
      /**
       * 0，表示 XMLHttpRequest 实例已经生成，但是实例的 open() 方法还没有被调用。
       * 1，表示 open() 方法已经调用，但是实例的 send() 方法还没有调用，仍然可以使用实例的 setRequestHeader() 方法，设定 HTTP 请求的头信息。
       * 2，表示实例的 send() 方法已经调用，并且服务器返回的头信息和状态码已经收到。
       * 3，表示正在接收服务器传来的数据体（body 部分）。这时，如果实例的 responseType 属性等于 text 或者空字符串，responseText 属性就会包含已经收到的部分信息。
       * 4，表示服务器返回的数据已经完全接收，或者本次接收已经失败。
       *
       */
      if (request.readyState !== 4) {
        return
      }

      // 组装响应数据
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData =
        responseType && responseType !== 'text' ? request.response : request.responseText
      const response: AxiosResponse = {
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        data: responseData,
        config,
        request
      }

      resolve(response)
    }

    // 处理请求 headers
    Object.keys(headers).forEach(name => {
      // data 为空时删除 content-type
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    request.send(data)
  })
}
