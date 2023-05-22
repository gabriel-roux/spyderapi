import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constants';
import { JwtStrategy } from './jwt.strategy';
import { JwtTokenService } from './jwt.service';

@Module({
  imports: [
    NestJwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2d' },
    }),
  ],
  providers: [JwtTokenService, JwtStrategy],
  exports: [JwtTokenService],
})
export class JwtModule {}
