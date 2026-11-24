export interface JwtPayload {
  sub: number; // id del usuario
  email: string;
  rol_id: number;
}

export interface AuthenticatedRequest {
  user: JwtPayload;
}
