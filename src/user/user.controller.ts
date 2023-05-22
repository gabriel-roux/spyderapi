import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UpdateAccountInformationsMessage } from './dtos/update-account-informations';
import { UpdatePasswordMessage } from './dtos/update-password';
import { UserService } from './user.service';
import * as crypto from 'node:crypto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('update-account-informations')
  @UseGuards(JwtAuthGuard)
  async updateAccountInformations(
    @Body() body: UpdateAccountInformationsMessage,
  ) {
    const { cpf, name, phone, userId } = body;

    const user = await this.userService.updateAccountInformations(
      cpf,
      name,
      phone,
      userId,
    );

    if (!user) {
      throw new Error('Error updating user informations');
    }

    return {
      message: 'User informations updated successfully',
      status: 200,
    };
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(@Body() body: UpdatePasswordMessage) {
    const { password, newPassword, userId } = body;

    const user = await this.userService.updatePassword(
      crypto.createHash('md5').update(password).digest('hex'),
      crypto.createHash('md5').update(newPassword).digest('hex'),
      userId,
    );

    if (!user) {
      throw new Error('Error updating user password');
    }

    return {
      message: 'User password updated successfully',
      status: 200,
    };
  }
}
