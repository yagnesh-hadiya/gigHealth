export type LoginFormDataType = {
  email: string;
  password: string;
};

export type ForgotPasswordDataType = {
  email: string;
};

export type ChangePasswordDataType = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type ResetPasswordDataType = {
  password: string;
  confirmPassword: string;
};

export interface UserProfile {
  firstName: string;
  lastName: string;
}

export type Permissions = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type Allows = {
  module: string;
  permissions: Permissions[];
  submodules?: Allows[];
}