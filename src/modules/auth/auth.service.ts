import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { UsuariosService } from '../usuarios/usuarios.service';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  private firmarToken(usuario: { id: number; email: string; rol_id: number }) {
    const payload: JwtPayload = {
      sub: usuario.id,
      email: usuario.email,
      rol_id: usuario.rol_id,
    };
    return this.jwtService.signAsync(payload);
  }

  // Crea el usuario (UsuariosService hashea la contraseña y asigna el rol por defecto)
  // y lo deja logueado devolviendo el token
  async register(createUsuarioDto: CreateUsuarioDto) {
    const usuario = await this.usuariosService.create(createUsuarioDto);

    return {
      access_token: await this.firmarToken(usuario),
      usuario,
    };
  }

  async login({ email, password }: LoginDto) {
    const usuario = await this.prisma.user.findUnique({
      where: { email },
      include: { rol: true },
    });

    // Mismo mensaje para email inexistente, usuario inactivo o contraseña mala:
    // así no revelamos qué emails están registrados
    const credencialesValidas =
      usuario &&
      usuario.activo &&
      (await bcrypt.compare(password, usuario.password_hash));

    if (!usuario || !credencialesValidas) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const { password_hash, ...datosUsuario } = usuario;

    return {
      access_token: await this.firmarToken(usuario),
      usuario: datosUsuario,
    };
  }

  async me(id: number) {
    const usuario = await this.usuariosService.findOne(id);

    if (!usuario.activo) {
      throw new UnauthorizedException('El usuario está inactivo');
    }

    return usuario;
  }
}
