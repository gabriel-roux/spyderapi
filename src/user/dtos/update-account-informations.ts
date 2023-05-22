import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAccountInformationsMessage {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  cpf: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
