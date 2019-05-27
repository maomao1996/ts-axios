import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { parseHeaders } from './helpers/headers'
import { createError } from './helpers/error'

// 发送 ajax 请求
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  // promise 化
  return new Promise((resolve, reject) => {
    const { url, method = 'GET', data = null, headers, responseType, timeout } = config

    // request.status 判断函数
    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }

    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    // 设置超时时间
    if (timeout) {
      request.timeout = timeout
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

      // 增加对 request.status 的判断，当出现网络错误或者超时错误的时候，该值都为 0
      if (request.status === 0) {
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

      // 对 request.status 的值再次判断
      handleResponse(response)
    }

    // 处理网络异常错误
    request.onerror = function handleError() {
      reject(createError('Network Error', config, null, request))
    }

    // 处理超时错误
    request.ontimeout = function handleTimeout() {
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
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
