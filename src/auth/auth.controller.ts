import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginMessage } from './dtos/login';
import { RegisterMessage } from './dtos/register';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { JwtTokenService } from './jwt/jwt.service';
import * as crypto from 'node:crypto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtTokenService: JwtTokenService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginMessage) {
    const { email, password } = body;

    const hashedPassword = crypto
      .createHash('md5')
      .update(password)
      .digest('hex');

    const user = await this.authService.login(email, hashedPassword);

    if (!user) {
      return {
        error: 'Invalid credentials',
      };
    }

    const token = await this.jwtTokenService.generateToken(user);

    return {
      user,
      token,
      message: 'Login successful',
    };
  }

  @Post('register')
  async register(@Body() body: RegisterMessage) {
    const { name, email, password } = body;

    const hashedPassword = crypto
      .createHash('md5')
      .update(password)
      .digest('hex');

    const user = await this.authService.register(name, email, hashedPassword);

    if (!user) {
      return {
        error: 'Error registering user',
      };
    }

    const token = await this.jwtTokenService.generateToken(user);

    return {
      user,
      token,
      message: 'User registered successfully',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException();
    }

    const decoded = await this.jwtTokenService.validateToken(token);

    if (!decoded) {
      throw new UnauthorizedException();
    }

    const user = await this.authService.validateUser(decoded.email);

    return {
      user,
      message: 'You are authenticated',
    };
  }
}
