import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async login(email: string, password: string) {
    return this.prismaService.user.findFirst({
      where: {
        email,
        password,
      },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        phone: true,
        created_at: true,
      },
    });
  }

  async register(name: string, email: string, password: string) {
    return this.prismaService.user.create({
      data: {
        name,
        email,
        password,
      },
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
      },
    });
  }

  async validateUser(email: string) {
    return this.prismaService.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        phone: true,
        created_at: true,
      },
    });
  }
}
