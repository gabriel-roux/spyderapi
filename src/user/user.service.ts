import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async updateAccountInformations(
    cpf: string,
    name: string,
    phone: string,
    userId: string,
  ) {
    return this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        cpf,
        name,
        phone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
      },
    });
  }

  async updatePassword(password: string, newPassword: string, userId: string) {
    const checkIfPasswordIsValid = await this.prismaService.user.findFirst({
      where: {
        id: userId,
        password,
      },
    });

    if (!checkIfPasswordIsValid) {
      return null;
    }

    return this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        password: newPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
      },
    });
  }
}
