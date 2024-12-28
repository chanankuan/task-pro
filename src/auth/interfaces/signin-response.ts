export interface ISigninResponse {
  access_token: string;
  refresh_token: string;
  user: {
    avatar_url: string;
    theme: string;
    name: string;
    email: string;
  };
}
