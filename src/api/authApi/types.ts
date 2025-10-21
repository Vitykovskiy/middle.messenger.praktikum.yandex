export interface ISignInPayload {
  login: string;
  password: string;
}

export interface ISignUpPayload {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
}

export interface ISignUpResponse {
  id: string;
}

export interface IUser {
  id: number | null;
  first_name: string | null;
  second_name: string | null;
  display_name: string | null;
  phone: string | null;
  login: string | null;
  avatar: string | null;
  email: string | null;
}

export function isUser(value: unknown): value is IUser {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const user = value as Partial<IUser>;

  return (
    (typeof user.id === 'number' || user.id === null) &&
    (typeof user.first_name === 'string' || user.first_name === null) &&
    (typeof user.second_name === 'string' || user.second_name === null) &&
    (typeof user.display_name === 'string' || user.display_name === null) &&
    (typeof user.phone === 'string' || user.phone === null) &&
    (typeof user.login === 'string' || user.login === null) &&
    (typeof user.avatar === 'string' || user.avatar === null) &&
    (typeof user.email === 'string' || user.email === null)
  );
}
