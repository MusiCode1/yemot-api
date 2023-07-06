import { AxiosResponse } from 'axios';

import { FileForUpload } from './file-for-upload';
import { BaseYemotApi } from './base-yemot-api';
import type { string_object } from './types';

export class YemotApi extends BaseYemotApi {

    logout(): Promise<AxiosResponse<void>> {
        return this.exec("Logout");
    };

    copy_files(target_path: string, files_path: Array<string>) {

        return this.exec("FileAction", {
            action: "copy",
            target: "ivr2:" + target_path,
            ...this.#make_what_files(files_path)
        });
    }

    move_files(target_path: string, files_path: Array<string>) {

        return this.exec("FileAction", {
            action: "move",
            target: "ivr2:" + target_path,
            ...this.#make_what_files(files_path)
        });
    }

    delete_file(files_path: Array<string>) {
        return this.exec("FileAction", {
            action: "delete",
            ...this.#make_what_files(files_path)
        });
    };

    upload_file(path: string, file: string | FileForUpload, convertAudio: 0 | 1 = 0) {

        return this.exec("UploadFile", {
            path,
            convertAudio,
            file
        });
    };

    download_file(path: string) {

        return this.exec("DownloadFile", {
            path
        });
    };

    get_ivr_tree(path: string) {
        return this.exec("GetIvrTree", {
            path: "ivr2:" + path
        });
    };

    get_incoming_calls() {
        return this.exec("GetIncomingCalls");
    }

    get_incoming_sum(from: string, to: string) {
        return this.exec("GetIncomingSum", {
            from, to
        });
    }

    get_session() {
        return this.exec("GetSession");
    };

    run_campaign(
        template_id: number,
        phones: Array<string> | null = null,
        caller_id: string | null = null
    ) {

        const param = {
            templateId: template_id,
            callerId: caller_id,
            phones: (phones) ? phones.join(":") : null
        };

        return this.exec("RunCampaign", param);
    };

    async create_ext(path: string, ini_settings_obj: string_object) {

        const ini_string_file = this.#ini_from_obj(ini_settings_obj);

        await this.exec("UpdateExtension", {
            path
        });

        return this.upload_txt_file(path + "/ext.ini", ini_string_file);
    };

    upload_ini_file(path: string, ini_settings_obj: string_object) {

        const ini_string_file = this.#ini_from_obj(ini_settings_obj);

        return this.upload_txt_file(path, ini_string_file);
    }

    upload_txt_file(path: string, text_file: string) {

        return this.exec("UploadTextFile", {
            what: "ivr2:/" + path,
            contents: text_file
        });
    }

    /*=========================================*/

    #make_what_files(files: Array<string>) {
        const final_files: string_object = {};
        let i = 0;
        for (const file of files) {
            final_files["what" + i] = "ivr2:" + file;
            i++;
        }
        return final_files;
    }

    #ini_from_obj(obj: string_object) {

        let ini_array: Array<string> = [];

        for (const i of Object.entries(obj)) {
            ini_array.push(i.join("="));
        }

        return ini_array.join("\n");
    }
}

