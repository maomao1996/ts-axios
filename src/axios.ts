import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types/index'
import xhr from './xhr'
import { buildURL } from './helpers/url'
import { processHeaders } from './helpers/headers'
import { transformRequest, transformResponse } from './helpers/data'

function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

function transformRequestData(config: AxiosRequestConfig): string {
  return transformRequest(config.data)
}

function processConfig(config: AxiosRequestConfig): void {
  // 处理 url
  config.url = transformURL(config)

  // 处理请求 headers （必须在处理 body 前处理）
  config.headers = transformHeaders(config)

  // 处理请求 body 数据
  config.data = transformRequestData(config)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transformResponse(res.data)
  return res
}

function axios(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)

  // 发送请求并处理响应 data
  return xhr(config).then(res => transformResponseData(res))
}

export default axios
