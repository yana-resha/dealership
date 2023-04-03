import React, { useCallback, useState } from 'react'

import { InputLabel } from '@mui/material'

import { UploadFile } from 'shared/ui/UploadFile/UploadFile'

import { DragAndDropWrapper } from '../../shared/ui/DragAndDropWrapper/DragAndDropWrapper'
import { FileUploadButton } from '../../shared/ui/FileUploadButton/FileUploadButton'
import SberTypography from '../../shared/ui/SberTypography'

type Props = {
  buttonText: string
  onChange: (files: File[]) => void
  uniqName: string
  title?: string
  text?: string
  multipleUpload?: boolean
}

export const FileUploadBlock = ({ buttonText, onChange, uniqName, title, text, multipleUpload }: Props) => {
  const [files, setFiles] = useState<File[]>([])

  const onChangeFiles = useCallback(
    (uploadFiles: FileList) => {
      const newState = multipleUpload ? [...files, ...Array.from(uploadFiles)] : Array.from(uploadFiles)
      setFiles(newState)
      onChange(newState)
    },
    [onChange, files, multipleUpload],
  )

  const onClickDelete = useCallback(
    (index: number) => {
      const newState = [...files!]
      newState.splice(index, 1)

      setFiles(newState)
      onChange(newState)
    },
    [files, onChange],
  )

  const uploadButtonConfig = {
    buttonText: files?.length ? 'Загрузить еще' : buttonText,
    uniqName,
    onChange: onChangeFiles,
    multiple: multipleUpload,
  }

  return title && text ? (
    <DragAndDropWrapper onChange={onChangeFiles}>
      <SberTypography sberautoVariant="h6" component="p">
        {title}
      </SberTypography>
      <InputLabel htmlFor={uniqName} style={{ whiteSpace: 'normal' }}>
        <SberTypography sberautoVariant="body3" component="p">
          {text}
        </SberTypography>
      </InputLabel>

      {!!files?.length &&
        files.map((file, i) => <UploadFile key={i} file={file} index={i} onClickDelete={onClickDelete} />)}

      {(!files.length || multipleUpload) && <FileUploadButton {...uploadButtonConfig} />}
    </DragAndDropWrapper>
  ) : (
    <div>
      {!!files?.length &&
        files.map((file, i) => <UploadFile key={i} file={file} index={i} onClickDelete={onClickDelete} />)}

      {(!files.length || multipleUpload) && <FileUploadButton {...uploadButtonConfig} />}
    </div>
  )
}
