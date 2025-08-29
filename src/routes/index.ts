import { SigninPage } from '@/pages/signinPage';
import { SignupPage } from '@/pages/signupPage';
import { ErrorPage } from '@/pages/errorPage';
import { NotFountPage } from '@/pages/notFoundPage';
import { ProfilePage } from '@/pages/profilePage';
import { ProfileEditPage } from '@/pages/profileEditPage';
import { ProfilePasswordPage } from '@/pages/profilePasswordPage';
import { MessengerPage } from '@/pages/messengerPage';
import type { IRouteRaw } from '@/modules/router/types';
import { store } from '@/modules/store';
import { USER_STORE_KEY } from '@/services/user/constants';
import user from '@/services/user';
import { router } from '@/modules/router';

export const enum RoutesNames {
  SigninPage = 'SigninPage',
  SignUpPage = 'SignUpPage',
  MessengerPage = 'MessengerPage',
  ProfilePage = 'ProfilePage',
  ProfileEdit = 'ProfileEdit',
  ProfilePassword = 'ProfilePassword',
  ErrorPage = 'ErrorPage',
  NotFound = 'NotFound'
}

export const routes: IRouteRaw[] = [
  {
    name: RoutesNames.SigninPage,
    path: '/',
    component: SigninPage
  },
  {
    name: RoutesNames.SignUpPage,
    path: '/sign-up',
    component: SignupPage
  },
  {
    name: RoutesNames.MessengerPage,
    path: '/messenger',
    parameters: ['id'],
    component: MessengerPage,
    guard: authGuard
  },
  {
    name: RoutesNames.ProfilePage,
    path: '/settings',
    component: ProfilePage,
    meta: { returnToBtn: RoutesNames.MessengerPage },
    guard: authGuard,
    children: [
      {
        name: RoutesNames.ProfileEdit,
        path: '/edit',
        component: ProfileEditPage,
        meta: { returnToBtn: RoutesNames.ProfilePage },
        guard: authGuard
      },
      {
        name: RoutesNames.ProfilePassword,
        path: '/password',
        component: ProfilePasswordPage,
        meta: { returnToBtn: RoutesNames.ProfilePage },
        guard: authGuard
      }
    ]
  },
  {
    name: RoutesNames.ErrorPage,
    path: '/500',
    component: ErrorPage
  },
  // Последний роут является дефолтным (рероут при отсутствии совпадений)
  {
    name: RoutesNames.NotFound,
    path: '/404',
    component: NotFountPage
  }
];

async function authGuard(): Promise<boolean> {
  const currentUser = store.get(USER_STORE_KEY);

  if (currentUser) {
    return true;
  }

  try {
    await user.initUser();
    return true;
  } catch (error) {
    console.error('>> initUser', error);
    router.go({ name: RoutesNames.SigninPage });

    return false;
  }
}
