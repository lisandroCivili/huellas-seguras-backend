import { IsInt, IsPositive } from 'class-validator';

export class AsignarRolDto {
  @IsInt({ message: 'El rol_id debe ser un número entero' })
  @IsPositive({ message: 'El rol_id debe ser mayor a 0' })
  rol_id: number;
}