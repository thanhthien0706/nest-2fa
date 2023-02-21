import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TwoFactorAuthModule } from './two-factor-auth/two-factor-auth.module';

@Module({
  imports: [TwoFactorAuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
