export type ApiError = {
  data?: {
    reason?: string;
  };
};

export const enum ResponseCodes {
  Ok = 200,
  BadRequest = 400,
  Unauthorized = 401,
  UnexpectedError = 500
}
