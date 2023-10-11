/* Oбязательная структура:
- в качестве ключа используется расширение файла
- в качестве значения - тип MIME
- Разделение на группы (image, text) по смыслу (не слишком строгое - так как влияет только на иконку файла) */
export const ALLOWED_FILE = {
  image: {
    jpeg: 'image/jpeg',
    png: 'image/png',
    heic: 'image/heic',
    bmp: 'image/bmp',
  },
  text: {
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    pdf: 'application/pdf',
    rtf: 'application/rtf',
    csv: 'text/csv',
    txt: 'text/plain',
  },
  table: {
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  },
}

export const allowedFileTypes = Object.values(ALLOWED_FILE)
  .map(fileGroupe => Object.values(fileGroupe))
  .flat()
  .join(',')

export const imageExtensions = Object.keys(ALLOWED_FILE.image)
export const textExtensions = Object.keys(ALLOWED_FILE.text)
export const tableExtensions = Object.keys(ALLOWED_FILE.table)
