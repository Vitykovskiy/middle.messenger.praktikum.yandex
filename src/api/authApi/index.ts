import http from '@/services/http';
import type { ISignInPayload, ISignUpPayload, ISignUpResponse, IUser } from './types';
import { ContentTypes } from '@/modules/http/constants';

const basePath = '/auth';

async function signin(request: ISignInPayload): Promise<string> {
  const { data } = await http.post<string>(basePath + '/signin', {
    data: request,
    contentType: ContentTypes.JSON
  });
  return data;
}

async function signup(request: ISignUpPayload): Promise<ISignUpResponse> {
  const { data } = await http.post<ISignUpResponse>(basePath + '/signup', {
    data: request,
    contentType: ContentTypes.JSON
  });
  return data;
}

async function logout(): Promise<string> {
  const { data } = await http.post<string>(basePath + '/logout', {
    contentType: ContentTypes.JSON
  });

  return data;
}

async function getUserInfo(): Promise<IUser> {
  const { data } = await http.get<IUser>(basePath + '/user');
  return data;
}

export default {
  signin,
  signup,
  logout,
  getUserInfo
};
