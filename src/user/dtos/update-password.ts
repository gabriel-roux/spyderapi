import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdatePasswordMessage {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
