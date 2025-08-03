export interface CreateUserConfirmationDialogData {
  email: string;
}

export interface CreateUserConfirmationDialogCloseData {
  token?: string;
  error?: string;
}
