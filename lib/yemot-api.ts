import type { FileForUpload } from './file-for-upload.js'
import { BaseYemotApi } from './base-yemot-api.js'
import type { string_object, stdr_return } from './types.js'

export class YemotApi extends BaseYemotApi {
  async logout(): stdr_return {
    return await this.exec('Logout')
  }

  async set_password(current_password: string, new_password: string): stdr_return {
    return await this.exec('SetPassword', {
      password: current_password,
      newPassword: new_password
    })
  }

  async copy_files(target_path: string, files_path: string[]): Promise<object> {
    return await this.exec('FileAction', {
      action: 'copy',
      target: 'ivr2:' + target_path,
      ...this.#make_what_files(files_path)
    })
  }

  async move_files(target_path: string, files_path: string[]) {
    return await this.exec('FileAction', {
      action: 'move',
      target: 'ivr2:' + target_path,
      ...this.#make_what_files(files_path)
    })
  }

  async delete_file(files_path: string[]) {
    return await this.exec('FileAction', {
      action: 'delete',
      ...this.#make_what_files(files_path)
    })
  }

  async upload_file(path: string, file: string | FileForUpload, convertAudio: 0 | 1 = 0) {
    return await this.exec('UploadFile', {
      path,
      convertAudio,
      file
    })
  }

  async download_file(path: string) {
    return await this.exec('DownloadFile', {
      path
    })
  }

  async get_ivr_tree(path: string) {
    return await this.exec('GetIvrTree', {
      path: 'ivr2:' + path
    })
  }

  async get_incoming_calls() {
    return await this.exec('GetIncomingCalls')
  }

  async get_incoming_sum(from: string, to: string) {
    return await this.exec('GetIncomingSum', {
      from, to
    })
  }

  async get_session(): Promise<object> {
    return await this.exec('GetSession')
  }

  async run_campaign(
    template_id: number,
    phones: string[] | null = null,
    caller_id: string | null = null
  ): Promise<object> {
    const param = {
      templateId: template_id,
      callerId: caller_id,
      phones: (phones != null) ? phones.join(':') : null
    }

    return await this.exec('RunCampaign', param)
  }

  async create_ext(path: string, ini_settings_obj: string_object) {
    const ini_string_file = this.#ini_from_obj(ini_settings_obj)

    await this.exec('UpdateExtension', {
      path: this.#add_prefix_to_path(path)
    })

    return await this.upload_txt_file(path + '/ext.ini', ini_string_file)
  }

  async upload_ini_file(path: string, ini_settings_obj: string_object) {
    const ini_string_file = this.#ini_from_obj(ini_settings_obj)

    return await this.upload_txt_file(path, ini_string_file)
  }

  async upload_txt_file(path: string, text_file: string) {
    return await this.exec('UploadTextFile', {
      what: this.#add_prefix_to_path(path),
      contents: text_file
    })
  }

  /* ========================================= */

  #make_what_files(files: string[]) {
    const final_files: string_object = {}
    let i = 0
    for (const file of files) {
      const file_with_prefix = this.#add_prefix_to_path(file)
      final_files['what' + i] = file_with_prefix
      i++
    }
    return final_files
  }

  #ini_from_obj(obj: string_object) {
    const ini_array: string[] = []

    for (const i of Object.entries(obj)) {
      ini_array.push(i.join('='))
    }

    return ini_array.join('\n')
  }

  #add_prefix_to_path(path: string) {
    if (!path.startsWith('ivr2:')) {
      return 'ivr2:' + path
    }
    return path;
  }
}
