import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { JwtPayload } from '../interfaces/jwt-payload.interface';

interface RequestConToken {
  headers: Record<string, string | undefined>;
  user?: JwtPayload;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestConToken>();
    const [tipo, token] = request.headers.authorization?.split(' ') ?? [];

    if (tipo !== 'Bearer' || !token) {
      throw new UnauthorizedException('Falta el token de autenticación');
    }

    try {
      request.user = await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    return true;
  }
}
