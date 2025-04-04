export interface ILoginForm {
  phone: string;
  password: string;
}
export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
}
