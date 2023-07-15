import type { AxiosResponse, AxiosRequestConfig } from 'axios'

export type method =
    'Login' |
    'Logout' |
    'GetSession' |
    'SetPassword' |

    'RunCampaign' |
    'GetCampaignStatus' |
    'GetActiveCampaigns' |
    'CampaignAction' |
    'DownloadCampaignReport' |

    'GetTemplates' |
    'CreateTemplate' |
    'DeleteTemplate' |
    'UpdateTemplate' |
    'GetTemplateEntries' |
    'ClearTemplateEntries' |
    'UpdateTemplateEntries' |
    'UpdateTemplateEntry' |

    'TransferUnits' |
    'GetTransactions' |

    'UploadPhoneList' |
    'ScheduleCampaign' |
    'GetScheduledCampaigns' |
    'DeleteScheduledCampaign' |
    'FileAction' |
    'UpdateExtension' |
    'UploadFile' |
    'DownloadFile' |
    'GetIvrTree' |
    'GetIncomingCalls' |
    'UploadTextFile' |
    'GetIVR2Dir' |
    'GetIncomingSum'

export interface YemotApiError extends Error {
  response: AxiosResponse
  request: any
  config: AxiosRequestConfig
}

export type string_object = Record<string, any>

export type success_obj = {
  yemotAPIVersion: 6,
  responseStatus: "OK"
};

export type stdr_return = Promise<AxiosResponse<success_obj>>;
