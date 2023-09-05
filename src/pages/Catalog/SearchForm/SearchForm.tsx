import { useCallback, useEffect, useMemo } from 'react'

import { Box } from '@mui/material'
import throttle from 'lodash/throttle'

import { ReactComponent as LoupeIcon } from 'assets/icons/loupe.svg'
import { useFindCatalogMutation } from 'shared/api/requests/fileStorageDc.api'
import { maskNoRestrictions } from 'shared/masks/InputMasks'
import { AutocompleteInput } from 'shared/ui/AutocompleteInput/AutocompleteInput'

import { useStyles } from './SearchForm.styles'

interface Props {
  fileName: string
  setFileName: React.Dispatch<React.SetStateAction<string>>
  onFoundFile: (fileName?: string, folderId?: number) => void
  onReset: () => void
}

export function SearchForm({ fileName, setFileName, onFoundFile, onReset }: Props) {
  const styles = useStyles()

  const { mutate: findCatalogMutate, data } = useFindCatalogMutation()

  const { options, optionMap, labelMap, folderMap } = useMemo(
    () =>
      (data?.found || []).reduce(
        (acc, cur) => {
          if (!cur.name || typeof cur.folderId !== 'number') {
            return acc
          }
          const key = `${cur.folderId}_${cur.name}`
          acc.options.push(key)
          acc.optionMap[key] = cur.name
          acc.labelMap[key] = cur.folderName ? `${cur.folderName || ''} / ${cur.name}` : `/ ${cur.name}`
          acc.folderMap[key] = cur.folderId

          return acc
        },
        { options: [], optionMap: {}, labelMap: {}, folderMap: {} } as {
          options: string[]
          optionMap: Record<string, string>
          labelMap: Record<string, string>
          folderMap: Record<string, number>
        },
      ),
    [data?.found],
  )

  const getLabel = useCallback((value: string) => labelMap[value] || '', [labelMap])

  const updateListOfSuggestions = useMemo(
    () =>
      throttle((value: string) => {
        findCatalogMutate({ desiredName: value })
      }, 1000),
    [findCatalogMutate],
  )

  const handleChange = useCallback(
    (value: string | string[] | null) => {
      if (typeof value !== 'string' && value !== null) {
        return
      }
      setFileName(value || '')
    },
    [setFileName],
  )

  const handleFileNameSelect = useCallback(
    (value: string | string[] | null) => {
      if (typeof value !== 'string') {
        return
      }
      setFileName(optionMap[value] || '')
      onFoundFile(optionMap[value] || '', folderMap[value] || 0)
    },
    [folderMap, onFoundFile, optionMap, setFileName],
  )

  const renderOption = useCallback(
    (props: React.HTMLAttributes<HTMLLIElement>, option: string) => (
      <li {...props} style={{ gap: 16 }}>
        <LoupeIcon />
        {getLabel(option)}
      </li>
    ),
    [getLabel],
  )

  useEffect(() => {
    if (fileName && fileName.length > 2) {
      updateListOfSuggestions(fileName)
    }
  }, [fileName, updateListOfSuggestions])

  useEffect(() => {
    if (!fileName) {
      onReset()
    }
  }, [fileName, onReset])

  return (
    <Box className={styles.container}>
      <Box flex={1}>
        <AutocompleteInput
          id="searchInput"
          value={fileName}
          onChange={handleChange}
          placeholder="Введите имя файла, который хотите найти"
          options={options}
          isCustomValueAllowed
          mask={maskNoRestrictions}
          onSelectOption={handleFileNameSelect}
          getOptionLabel={getLabel}
          renderOption={renderOption}
        />
      </Box>
    </Box>
  )
}
