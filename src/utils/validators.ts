export function firstNameValidator(value: string): string | null {
  return validateField('first_name', value);
}

export function secondNameValidator(value: string): string | null {
  return validateField('second_name', value);
}

export function loginValidator(value: string): string | null {
  return validateField('login', value);
}

export function emailValidator(value: string): string | null {
  return validateField('email', value);
}

export function passwordValidator(value: string): string | null {
  return validateField('password', value);
}

export function phoneValidator(value: string): string | null {
  return validateField('phone', value);
}

export function emptyValidator(value: string): string | null {
  return validateField('empty', value);
}

function validateField(field: keyof typeof RULES, value: string): string | null {
  const pattern = RULES[field];

  if (pattern && !pattern.test(value)) {
    return ERROR_MESSAGES[field];
  }

  return null;
}

const RULES = {
  // Имя и Фамилия: первая буква заглавная (латиница или кириллица), затем буквы или дефис
  first_name: /^(?:[A-ZА-Я][a-zа-я-]*)$/,
  second_name: /^(?:[A-ZА-Я][a-zа-я-]*)$/,
  // Логин: 3–20 символов, латиница + цифры, допускается "-" и "_",
  login: /^(?!\d+$)[A-Za-z0-9_-]{3,20}$/,
  // Email: латиница, может содержать цифры, дефис, "_",
  // обязательно @, после него буквы, точка, и снова буквы
  email: /^[A-Za-z0-9._-]+@[A-Za-z0-9-]+\.[A-Za-z]+$/,
  // Пароль: 8–40 символов, хотя бы одна заглавная и одна цифра
  password: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,40}$/,
  // Телефон: 10–15 цифр, допускается ведущий +
  phone: /^\+?\d{10,15}$/,
  // Сообщение: непустая строка (хотя бы один не-пробельный символ)
  empty: /\S+/
};

const ERROR_MESSAGES = {
  first_name: 'Имя должно начинаться с заглавной буквы и содержать только буквы или дефис.',
  second_name: 'Фамилия должна начинаться с заглавной буквы и содержать только буквы или дефис.',
  login: 'Логин 3–20 символов, латиница, цифры, "-" или "_", не только цифры.',
  email: 'Некорректный email.',
  password: 'Пароль 8–40 символов, с заглавной буквой и цифрой.',
  phone: 'Телефон 10–15 цифр, может начинаться с "+".',
  empty: 'Поле не должно быть пустым.'
};
