import type { IUserData } from './types';

export function getUserData(): IUserData {
  return USER_TEST_DATA;
}

const USER_TEST_DATA = {
  email: 'why@fox-kids.com',
  login: 'vitoto',
  firstName: 'Виктор',
  secondName: 'Почемучкин',
  displayName: 'Say_My_Name',
  phone: '555-011-0111',
  password: '123567'
};
