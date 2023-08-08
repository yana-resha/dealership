import { megaBiteToBite } from 'shared/utils/megaBiteToBite'

export const MAX_FILE_SIZE_MB = 15
export const maxFileSizeBite = megaBiteToBite(MAX_FILE_SIZE_MB)
export const ALLOWED_FILE_TYPES = 'image/jpeg,image/png,application/pdf'
