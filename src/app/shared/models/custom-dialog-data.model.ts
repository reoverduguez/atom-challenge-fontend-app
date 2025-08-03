export interface CreateUserConfirmationDialogData {
  email: string;
}

export interface CreateUserConfirmationDialogCloseData {
  token?: string;
  error?: string;
}

export interface CreateTaskDialogCloseData {
  title: string;
  description: string;
}
