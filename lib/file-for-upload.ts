interface prop {
  file_name: string
  data: string | Buffer
  content_type?: string
}
export class FileForUpload {
  public file_name: string
  public data: string | Buffer
  public content_type?: string

  constructor ({ file_name, data, content_type }: prop) {
    this.file_name = file_name
    this.data = data
    this.content_type = content_type
  }
}
