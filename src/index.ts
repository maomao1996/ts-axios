import { AxiosRequestConfig } from './types/index'
import xhr from './xhr'
import { buildURL } from './helpers/url'

function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
}

function axios(config: AxiosRequestConfig): void {
  // 处理 url
  processConfig(config)

  // 发送请求
  xhr(config)
}

export default axios
