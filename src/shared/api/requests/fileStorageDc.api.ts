import {
  CreateCatalogRequest,
  GetCatalogRequest,
  GetCatalogResponse,
  RemoveCatalogRequest,
  UploadFileRequest,
  createFileStorageDc,
  ObjectType,
  DownloadFileRequest,
  Catalog,
  FindCatalogRequest,
} from '@sberauto/filestoragedc-proto/public'
import { useSnackbar } from 'notistack'
import { UseQueryOptions, useMutation, useQuery } from 'react-query'

import { appConfig } from 'config'
import { Rest } from 'shared/api/client'

const fileStorageDcApi = createFileStorageDc(`${appConfig.apiUrl}/filestoragedc`, Rest.request)

function prepareObjectType(type: keyof typeof ObjectType | undefined | null): ObjectType | undefined {
  return type ? ObjectType[type] ?? undefined : undefined
}

export interface RequiredCatalog extends Catalog {
  id: number
  type: ObjectType
}
export interface RequiredGetCatalogResponse extends GetCatalogResponse {
  catalog: RequiredCatalog[]
}

function compareFileName(a: RequiredCatalog, b: RequiredCatalog) {
  const aName = a.name || ''
  const bName = b.name || ''
  const aNumber = parseFloat(aName)
  const bNumber = parseFloat(bName)
  if (!!aNumber && !!bNumber) {
    return aNumber - bNumber
  }
  if (aName > bName) {
    return 1
  }
  if (aName < bName) {
    return -1
  }

  return 0
}
function prepareCatalog(data: GetCatalogResponse) {
  const { folders, files } = (data.catalog || []).reduce(
    (acc, cur) => {
      if (typeof cur.id !== 'number') {
        return acc
      }
      const type = prepareObjectType(cur.type as unknown as keyof typeof ObjectType)

      if (type === ObjectType.FOLDER) {
        acc.folders.push({ ...cur, id: cur.id, type })
      }
      if (type === ObjectType.FILE) {
        acc.files.push({ ...cur, id: cur.id, type })
      }

      return acc
    },
    { folders: [], files: [] } as { folders: RequiredCatalog[]; files: RequiredCatalog[] },
  )

  const sortedFolders = folders.sort(compareFileName)
  const sortedFiles = files.sort(compareFileName)

  return { ...data, catalog: [...sortedFolders, ...sortedFiles] }
}

export const getCatalog = (params: GetCatalogRequest) =>
  fileStorageDcApi
    .getCatalog({ data: params })
    .then(res => (res.data ? prepareCatalog(res.data) : res.data ?? {}))

export const useGetCatalogQuery = (
  params: GetCatalogRequest,
  options?: UseQueryOptions<
    RequiredGetCatalogResponse,
    unknown,
    RequiredGetCatalogResponse,
    (string | number | undefined)[]
  >,
) => useQuery(['getCatalog', params.folderId], () => getCatalog(params), { ...options })

export const createCatalog = (params: CreateCatalogRequest) =>
  fileStorageDcApi.createCatalog({ data: params }).then(res => res.data ?? {})
export const useCreateCatalogMutation = () => {
  const { enqueueSnackbar } = useSnackbar()

  return useMutation(['createCatalog'], createCatalog, {
    onError: () => {
      enqueueSnackbar('Ошибка. Не удалось создать каталог', {
        variant: 'error',
      })
    },
  })
}

export const removeCatalog = (params: RemoveCatalogRequest) =>
  fileStorageDcApi.removeCatalog({ data: params }).then(res => res.data ?? {})
export const useRemoveCatalogMutation = () => {
  const { enqueueSnackbar } = useSnackbar()

  return useMutation(['removeCatalog'], removeCatalog, {
    onError: () => {
      enqueueSnackbar('Ошибка. Не удалось удалить каталог/файл', {
        variant: 'error',
      })
    },
  })
}

export const findCatalog = (params: FindCatalogRequest) =>
  fileStorageDcApi.findCatalog({ data: params }).then(res => res.data ?? {})
export const useFindCatalogMutation = () => {
  const { enqueueSnackbar } = useSnackbar()

  return useMutation(['findCatalog'], findCatalog, {
    onError: () => {
      enqueueSnackbar('Ошибка. Не удалось загрузить файл', {
        variant: 'error',
      })
    },
  })
}

type UploadFileRequestMod = Omit<UploadFileRequest, 'document'> & {
  document: File
}
export const uploadFile = (data: UploadFileRequestMod) => {
  const url = `${appConfig.apiUrl}/filestoragedc`
  const endpoint = 'uploadFile'
  const formData = new FormData()
  formData.append('document', data.document)
  formData.append('folder_id', `${data.folderId}`)

  return Rest.request(`${url}/${endpoint}`, { data: formData })
}
export const useUploadFileMutation = () => {
  const { enqueueSnackbar } = useSnackbar()

  return useMutation(['uploadFile'], uploadFile, {
    onError: () => {
      enqueueSnackbar('Ошибка. Не удалось загрузить файл', {
        variant: 'error',
      })
    },
  })
}

export const downloadFile = (data: DownloadFileRequest): Promise<File> => {
  const url = `${appConfig.apiUrl}/filestoragedc`
  const endpoint = 'downloadFile'

  return Rest.request<DownloadFileRequest, File>(`${url}/${endpoint}`, {
    data,
    isResponseBlob: true,
  })
}
export const useDownloadFileMutation = () => {
  const { enqueueSnackbar } = useSnackbar()

  return useMutation(['downloadFile'], downloadFile, {
    onError: () => {
      enqueueSnackbar('Ошибка. Не удалось скачать файл', {
        variant: 'error',
      })
    },
  })
}
