export interface IEditPasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface IEditProfilePayload {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
}

export interface IUserSearchPayload {
  login: string;
}
