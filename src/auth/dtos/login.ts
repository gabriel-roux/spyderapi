import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginMessage {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
