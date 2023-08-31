import { megaBiteToBite } from 'shared/utils/megaBiteToBite'

export const DEFAULT_MAX_FILE_SIZE_MB = 15
export const defaultMaxFileSizeBite = megaBiteToBite(DEFAULT_MAX_FILE_SIZE_MB)
export const DEFAULT_ALLOWED_FILE_TYPES = 'image/jpeg,image/png,application/pdf'
export const DEFAULT_FILE_NAME = 'Файл'
