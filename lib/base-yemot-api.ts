import Axios, { type AxiosInstance, type AxiosResponse, type AxiosRequestConfig, AxiosError } from 'axios'
import { createReadStream } from 'fs'
import FormData from 'form-data'
import qs from 'qs'

import type { method, YemotApiError, string_object } from './types.js'
import { FileForUpload } from './file-for-upload.js'
import { make_axios_instance } from "./axios-instance.js";

interface upload_file_parameters {
  path: string
  convertAudio: 0 | 1
  file: FileForUpload | string
}

export class BaseYemotApi {
  #yemot_con: AxiosInstance

  #token = ''

  #is_connect = false

  #login_param = {
    username: '',
    password: ''
  }

  public get token (): string {
    return this.#token
  }

  constructor (username: string, password: string, axios_config: AxiosRequestConfig = {}) {

    this.#login_param = {
      username,
      password
    }

    this.#yemot_con =make_axios_instance(axios_config);
  }

  async exec<T>(method: method, parameters = {}, options: AxiosRequestConfig = {}) {
    try {
      if (!this.#is_connect && method !== 'Login') {
        await this.login()
      }

      const request = this.#make_request(method, parameters, options)
      options = request.options
      const data = request.data

      let response = await this.#yemot_con.post(method, data, options)

      if (method === 'DownloadFile' || response.data?.responseStatus === 'OK') {
        return response
      } else { // On Yemot error
        if (this.#check_if_cookies_have_expired(response)) {
          await this.login()
          response = await this.#yemot_con.post(method, data, options)
          return response
        } else {
          const error = this.#yemot_error(response)
          throw error
        }
      }
    } catch (error) {
      if (Axios.isAxiosError(error) && (error.response != null)) {
        if (method === 'DownloadFile' &&
					error.response.status == 404
        ) {
          throw (error.response.data)
        }
      }

      throw error
    }
  }

  async login () {
    const response = await this.exec('Login', this.#login_param)

    if (response.data && response.data.responseStatus !== 'OK') {
      throw (response.data.responseStatus + ': ' + response.data.message)
    }

    this.#token = response.data.token

    this.#is_connect = true
  }

  #make_request (method: method, parameters: string_object, options: AxiosRequestConfig) {
    let data: string | Buffer

    if (method !== 'Login') {
      parameters.token = this.#token
    }

    switch (method) {
      case 'UploadFile':
        ({ options, data } = this.#create_file_upload_request(parameters as upload_file_parameters, options))
        break

      case 'DownloadFile':
        ({ options } = this.#create_file_download_request(parameters as upload_file_parameters, options));
        ({ options, data } = this.#create_default_request(parameters as upload_file_parameters, options))
        break

      default:
        ({ options, data } = this.#create_default_request(parameters, options))
        break
    }

    return {
      options,
      data
    }
  }

  #check_if_cookies_have_expired (response: AxiosResponse) {
    if ((response.data.responseStatus === 'EXCEPTION' &&
			response.data.message ===
			'IllegalStateException(session token is invalid)') ||
			(response.data.responseStatus === 'FORBIDDEN' &&
				response.data.message ===
				'session is expired')
    ) {
      return true
    }
    return false
  }

  #yemot_error (response: AxiosResponse) {
    let error_message = ''

    if (response.data.exceptionMessage) {
      error_message = response.data.exceptionMessage
    } else if (response.data.message) {
      error_message = response.data.message
    }

    const error = new Error(error_message) as YemotApiError
    error.response = response

    return error
  }

  #create_file_upload_request (parameters: upload_file_parameters, options: AxiosRequestConfig) {
    const file = parameters.file

    const form = new FormData()

    if (file instanceof FileForUpload) {
      form.append('file', file.data, {
        filename: file.file_name,
        contentType: file.content_type
      })
    } else if (typeof file === 'string') {
      form.append('file', createReadStream(file))
    }

    for (const [key, value] of Object.entries(parameters)) {
      if (key !== 'file') {
        form.append(key, value)
      }
    }

    options.headers = form.getHeaders()

    return {
      data: form.getBuffer(),
      options
    }
  }

  #create_file_download_request (parameters: upload_file_parameters, options: AxiosRequestConfig) {
    options.responseType = options.responseType || 'arraybuffer'
    return {
      options
    }
  }

  #create_default_request (parameters: string_object, options: AxiosRequestConfig) {
    options.headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
    const data = qs.stringify(parameters)
    return {
      data,
      options
    }
  }
}
