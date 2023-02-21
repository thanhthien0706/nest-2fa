import { Body, Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import {
  generateOTPToken,
  generateQRCode,
  generateUniqueSecret,
  verifyOTPToken,
} from 'src/common/two-factor';
import { Response } from 'express';

@Controller()
export class TwoFactorAuthController {
  private MOCK_USER;

  constructor() {
    this.MOCK_USER = {
      username: 'ThanhThien',
      password: 'ThanhThien',
      is2FAEnabled: true,
      secret: generateUniqueSecret(),
    };
  }

  @Get('2fa-enable')
  @Render('enable2FA')
  getEnable2FAPage() {}

  @Post('2fa-enable')
  async postEnable2FAPage(@Res() res: Response) {
    try {
      let user = this.MOCK_USER;
      const serviceName = 'thanhthien.com';

      const otpAuth = generateOTPToken(user.username, serviceName, user.secret);
      const qrCodeImage = await generateQRCode(otpAuth);
      return res.status(200).json({ qrCodeImage });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  @Get('login')
  @Render('login')
  getLoginPage() {}

  @Post('login')
  postLoginPage(@Body() body, @Res() res: Response) {
    try {
      let user = this.MOCK_USER;
      const { username, password } = body;

      if (username === user.username && password === user.password) {
        if (user.is2FAEnabled) {
          return res.status(200).json({
            isCorrectIdentifier: true,
            is2FAEnabled: true,
            isLoggedIn: false,
          });
        }

        return res.status(200).json({
          isCorrectIdentifier: true,
          is2FAEnabled: false,
          isLoggedIn: true,
        });
      }

      // Trường hợp đăng nhập thất bại (do thông tin đăng nhập không chính xác)
      return res.status(200).json({
        isCorrectIdentifier: false,
        is2FAEnabled: false,
        isLoggedIn: false,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  @Get('verify-2fa')
  @Render('verify2FA')
  getVerify2FA() {}

  @Post('verify-2fa')
  async postVerify2FA(@Body() body, @Res() res: Response) {
    try {
      let user = this.MOCK_USER;

      const { otpToken } = body;
      const isValid = verifyOTPToken(otpToken, user.secret);

      return res.status(200).json({ isValid });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
