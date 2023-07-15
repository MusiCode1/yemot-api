import Axios, { type AxiosRequestConfig } from 'axios'

export const make_axios_instance =
    (axios_config: AxiosRequestConfig = {}) => Axios.create({
        baseURL: `https://www.call2all.co.il/ym/api/`,
        maxContentLength: Infinity,
        ...axios_config
    });