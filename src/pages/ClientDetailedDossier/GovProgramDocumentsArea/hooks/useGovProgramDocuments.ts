import { useCallback, useEffect, useMemo, useState } from 'react'

import { DocumentType, Scan } from '@sberauto/loanapplifecycledc-proto/public'

import { updateApplication } from 'entities/order'
import { selectApplicationScans } from 'entities/order/model/selectors'
import { DocumentUploadStatus, FileInfo, UploaderConfig } from 'features/ApplicationFileLoader'
import { useDeleteDocumentMutation } from 'shared/api/requests/loanAppLifeCycleDc'
import { useAppDispatch } from 'shared/hooks/store/useAppDispatch'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'

import {
  GOV_PROGRAM_DOCUMENT_LABELS,
  GOV_PROGRAM_DOCUMENT_NAMES_MAP,
} from '../GovProgramDocumentsArea.config'

const checkDocumentType = (type: DocumentType | null | undefined): type is DocumentType =>
  type !== undefined && type !== null

type Props = {
  dcAppId: string
  govProgramScans: Scan[]
  necessaryGovProgramDocuments: (DocumentType | DocumentType[])[]
  currentGovProgramScans: (Scan | undefined)[]
  onRemoveStatement: () => void
}

export function useGovProgramDocuments({
  dcAppId,
  govProgramScans,
  necessaryGovProgramDocuments,
  currentGovProgramScans,
  onRemoveStatement,
}: Props) {
  const dispatch = useAppDispatch()
  const scans = useAppSelector(selectApplicationScans)

  const [filesMap, setFilesMap] = useState<Record<string, FileInfo | null>>({})
  const [selectedDocumentTypesMap, setSelectedDocumentTypesMap] = useState<Record<string, DocumentType>>({})

  const { mutate: deleteDocumentMutate } = useDeleteDocumentMutation()

  const unnecessaryDocumentTypes = useMemo(
    () =>
      govProgramScans
        .filter(
          (scan): scan is Scan & { type: DocumentType } =>
            checkDocumentType(scan?.type) && !necessaryGovProgramDocuments.flat().includes(scan.type),
        )
        .map(scan => scan.type),
    [govProgramScans, necessaryGovProgramDocuments],
  )

  const uploaderConfigs = useMemo(
    () =>
      necessaryGovProgramDocuments.map((document, i): UploaderConfig => {
        const isArray = Array.isArray(document)
        const documents = isArray
          ? document.map(doc => ({ label: GOV_PROGRAM_DOCUMENT_NAMES_MAP[doc] || '', value: doc }))
          : undefined

        return {
          documentLabel: isArray
            ? GOV_PROGRAM_DOCUMENT_LABELS[i]
            : GOV_PROGRAM_DOCUMENT_NAMES_MAP[document] || GOV_PROGRAM_DOCUMENT_LABELS[i],
          documentFile: filesMap[i],
          documentType: isArray ? selectedDocumentTypesMap[i] : document,
          documentTypeOptions: documents,
          documentName: `${i}`,
        }
      }),
    [selectedDocumentTypesMap, filesMap, necessaryGovProgramDocuments],
  )

  const downloaderConfigs = useMemo(
    () =>
      uploaderConfigs.map((config, i) => ({
        ...config,
        documentLabel: GOV_PROGRAM_DOCUMENT_NAMES_MAP[selectedDocumentTypesMap[i]] || config.documentLabel,
      })),
    [selectedDocumentTypesMap, uploaderConfigs],
  )

  const handleUploadDocument = useCallback(
    (file: FileInfo['file'], documentName: string, status: FileInfo['status']) => {
      const { documentType } = uploaderConfigs[parseInt(documentName, 10)]
      const filteredScans = (scans || []).filter(scan => scan.type !== documentType)
      setFilesMap(prev => ({ ...prev, [documentName]: { file, status } }))
      if (status === DocumentUploadStatus.Uploaded) {
        dispatch(updateApplication({ scans: [...filteredScans, { type: documentType, name: file.name }] }))
      }
    },
    [dispatch, scans, setFilesMap, uploaderConfigs],
  )

  const handleChangeOption = useCallback((documentName: string, documentType: string | DocumentType) => {
    setSelectedDocumentTypesMap(prev => ({ ...prev, [documentName]: documentType as DocumentType }))
  }, [])

  const handleRemoveDocument = useCallback(
    (documentName: string) => {
      const { documentType } = uploaderConfigs[parseInt(documentName, 10)]
      if (documentType) {
        deleteDocumentMutate(
          {
            dcAppId,
            documentType: [documentType],
          },
          {
            onSuccess: () => {
              const filteredScans = (scans || []).filter(scan => scan.type !== documentType)
              dispatch(updateApplication({ scans: filteredScans }))
              setFilesMap(prev => ({ ...prev, [documentName]: null }))
              if (documentType === DocumentType.COMMITMENT_STATEMENT) {
                onRemoveStatement()
              }
            },
          },
        )
      }
    },
    [dcAppId, deleteDocumentMutate, dispatch, onRemoveStatement, scans, uploaderConfigs],
  )

  useEffect(() => {
    if (unnecessaryDocumentTypes.length) {
      deleteDocumentMutate(
        {
          dcAppId,
          documentType: unnecessaryDocumentTypes,
        },
        {
          onSuccess: () => {
            const filteredScans = (scans || []).filter(
              scan => checkDocumentType(scan.type) && !unnecessaryDocumentTypes.includes(scan.type),
            )
            dispatch(updateApplication({ scans: filteredScans }))
          },
        },
      )
    }
  }, [dcAppId, deleteDocumentMutate, dispatch, scans, unnecessaryDocumentTypes])

  useEffect(() => {
    currentGovProgramScans.forEach((scan, i) => {
      if (scan?.type && scan?.name) {
        setFilesMap(prev => ({
          ...prev,
          [i]: {
            file: {
              dcAppId,
              documentType: scan.type as DocumentType,
              name: scan.name as string,
            },
            status: DocumentUploadStatus.Uploaded,
          },
        }))
        setSelectedDocumentTypesMap(prev => ({ ...prev, [i]: scan.type as DocumentType }))
      }
    })
  }, [currentGovProgramScans, dcAppId])

  return {
    uploaderConfigs,
    downloaderConfigs,
    handleUploadDocument,
    handleChangeOption,
    handleRemoveDocument,
  }
}
