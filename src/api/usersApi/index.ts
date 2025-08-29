import { ContentTypes } from '@/modules/http/constants';
import type { IUser } from '../authApi/types';
import type { IEditPasswordPayload, IEditProfilePayload, IUserSearchPayload } from './types';
import http from '@/services/http';

const basePath = '/user';

async function editPassword(request: IEditPasswordPayload): Promise<string> {
  const { data } = await http.put<string>(basePath + '/password', {
    data: request,
    contentType: ContentTypes.JSON
  });
  return data;
}

async function editProfile(request: IEditProfilePayload): Promise<IUser> {
  const { data } = await http.put<IUser>(basePath + '/profile', {
    data: request,
    contentType: ContentTypes.JSON
  });
  return data;
}

async function editAvatar(request: FormData): Promise<IUser> {
  const { data } = await http.put<IUser>(basePath + '/profile/avatar', {
    data: request
  });
  return data;
}

async function userSearch(request: IUserSearchPayload): Promise<IUser[]> {
  const { data } = await http.post<IUser[]>(basePath + '/search', {
    data: request,
    contentType: ContentTypes.JSON
  });
  return data;
}

export default {
  editPassword,
  editProfile,
  editAvatar,
  userSearch
};
