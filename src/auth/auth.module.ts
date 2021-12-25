import { HttpModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountModule } from '../inpostack/account/account.module';
import { LocalStrategy } from './strategy/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { StoreModule } from '../inpostack/market/store/store.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLoginEvent } from '../event/user-login-event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserLoginEvent]),
    ConfigModule.forRoot(),
    PassportModule,
    HttpModule,
    AccountModule,
    StoreModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AccountModule, StoreModule],
})
export class AuthModule {}
