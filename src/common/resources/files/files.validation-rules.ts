import { FileTypes } from './file.types';

export const IMAGE_FILE_TYPES = ['image/jpeg', 'image/pjpeg', 'image/png'];
export const PDF_FILE_TYPES = ['application/pdf'];

export const FilesValidationRules = {
  filesContentTypes: {
    jpg: {
      contentTypes: ['image/jpeg', 'image/pjpeg'],
      extension: 'jpg',
    },
    png: {
      contentTypes: ['image/png'],
      extension: 'png',
    },
    pdf: {
      contentTypes: ['application/pdf'],
      extension: 'pdf',
    },
  },
  supportedTypes: {
    [FileTypes.avatar]: IMAGE_FILE_TYPES,
  },
  maxUploadFiles: 10,
};
