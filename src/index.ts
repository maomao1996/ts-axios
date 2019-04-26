import { AxiosRequestConfig } from './types/index'
import xhr from './xhr'
import { buildURL } from './helpers/url'
import { processHeaders } from './helpers/headers'
import { transformRequest } from './helpers/data'

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

  // 处理 headers （必须在处理 body 前处理）
  config.headers = transformHeaders(config)

  // 处理 body 数据
  config.data = transformRequestData(config)
}

function axios(config: AxiosRequestConfig): void {
  processConfig(config)

  // 发送请求
  xhr(config)
}

export default axios
