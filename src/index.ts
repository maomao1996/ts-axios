import { AxiosRequestConfig } from './types/index'
import xhr from './xhr'

function axios(config: AxiosRequestConfig): void {
  xhr(config)
}

export default axios
