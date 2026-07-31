export interface LoginResponse {
  accessToken: string;
  expiration: string;
  usuarioId: string;
  username: string;
  email: string;
  roles: string[];
}
