import authApi from '@/api/authApi';
import usersApi from '@/api/usersApi';
import { RoutesNames } from '@/routes';
import { store } from '@/modules/store';
import { router } from '@/modules/router';
import type { IEditPasswordPayload, IEditProfilePayload } from '@/api/usersApi/types';
import { type ISignInPayload, type ISignUpPayload, type IUser } from '@/api/authApi/types';
import { USER_STORE_KEY, USERS_SEARCH_STORE_KEY } from './constants';
import type { ApiError } from '../http/types';

async function signIn(data: ISignInPayload): Promise<void> {
  try {
    await authApi.signin(data);
    await initUser();
    router.go({ name: RoutesNames.MessengerPage });
  } catch (error) {
    const err = error as ApiError;
    if (err?.data?.reason === 'User already in system') {
      router.go({ name: RoutesNames.MessengerPage });
    } else {
      console.error('>> Signup:', error);
    }
  }
}

async function signUp(data: ISignUpPayload): Promise<void> {
  try {
    await authApi.signup(data);
    router.go({ name: RoutesNames.MessengerPage });
  } catch (error) {
    console.error('>> Siginin:', error);
  }
}

async function initUser(): Promise<void> {
  const user = await authApi.getUserInfo();
  store.set(USER_STORE_KEY, user);
}

async function logout(): Promise<void> {
  try {
    await authApi.logout();
    store.set(USER_STORE_KEY, null);
    router.go({ name: RoutesNames.SigninPage });
  } catch (error) {
    console.error('>> Logout:', error);
  }
}

async function editPassword(data: IEditPasswordPayload): Promise<void> {
  try {
    await usersApi.editPassword(data);
    router.go({ name: RoutesNames.ProfilePage });
  } catch (error) {
    console.error('>> Change password:', error);
  }
}

async function editProfile(request: IEditProfilePayload): Promise<void> {
  try {
    const user = await usersApi.editProfile(request);
    store.set(USER_STORE_KEY, user);
    router.go({ name: RoutesNames.ProfilePage });
  } catch (error) {
    console.error('>> Change password:', error);
  }
}

async function editAvatar(request: FormData): Promise<void> {
  try {
    const user = await usersApi.editAvatar(request);
    store.set(USER_STORE_KEY, user);
  } catch (error) {
    console.error('>> Edit avatar:', error);
  }
}

async function userSearch(login: string): Promise<void> {
  const users = await usersApi.userSearch({ login });
  store.set(USERS_SEARCH_STORE_KEY, users);
}

async function clearUserSearch(): Promise<void> {
  store.set(USERS_SEARCH_STORE_KEY, null);
  return;
}

function isCurrentUserByLogin(login: string): boolean {
  return (store.get(USER_STORE_KEY) as IUser).login === login;
}

function isCurrentUserById(id: number): boolean {
  return (store.get(USER_STORE_KEY) as IUser).id === id;
}

export default {
  signIn,
  signUp,
  initUser,
  logout,
  editPassword,
  editProfile,
  editAvatar,
  userSearch,
  clearUserSearch,
  isCurrentUserByLogin,
  isCurrentUserById
};
