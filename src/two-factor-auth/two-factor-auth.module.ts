import { Module } from '@nestjs/common';
import { TwoFactorAuthController } from './two-factor-auth.controller';

@Module({
  controllers: [TwoFactorAuthController]
})
export class TwoFactorAuthModule {}
