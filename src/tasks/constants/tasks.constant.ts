export enum TaskState {
  CREATED = 'created',
  UPLOADED = 'uploaded',
  RESIZED = 'resized',
}

export const INPUT_DIR = 'upload';
export const OUTPUT_DIR = 'output';

const MAX_FILE_SIZE_MB = 20

export const MAX_FILE_SIZE_BYTES = 1024 * 1024 *  MAX_FILE_SIZE_MB;