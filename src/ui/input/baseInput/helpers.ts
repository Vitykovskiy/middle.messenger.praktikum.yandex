export function isFilesExists(value: unknown): value is FileList {
  return value instanceof FileList && !!value.length;
}
