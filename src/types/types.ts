export enum PermissionActionTypes {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum NotificationType {
  Error = 'error',
  Success = 'success',
}

export enum VideoStatus {
  OriginalFileUpload = 1,
  StartedConverting = 2,
  ConvertedFileUpload = 3,
  Error = 4,
  Republish = 5,
  LoadingToMinioServer = 6,
  Pause = 7,
}
