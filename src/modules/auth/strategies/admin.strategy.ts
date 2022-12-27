import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import * as crypto from 'crypto';
import jwtDecode from 'jwt-decode';
import { ConfigService } from '@nestjs/config';
import { AuthenticationException } from '../../../exceptions/authentication.exception';
import { hoUrl, url } from '../../../handlebars-helpers/url';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(private configService: ConfigService) {
    super();
  }

  async validate(req: Request) {
    let accessToken, refreshToken;

    if (req.header('biz_atk') && req.header('biz_rtk')) {
      accessToken = req.header('biz_atk');
      refreshToken = req.header('biz_rtk');
    } else {
      accessToken = req.cookies['biz_atk'];
      refreshToken = req.cookies['biz_rtk'];
    }

    if (!accessToken || !refreshToken) {
      throw new AuthenticationException(
        '로그인을 해주세요',
        hoUrl(`/login?URL=${encodeURIComponent(url(req.url))}`),
      );
    }

    return jwtDecode(
      this.decryptAccessToken(
        accessToken,
        this.decrypt(
          this.encrypt(
            crypto
              .createHash('SHA256')
              .update(
                `${this.configService.get('JWT_PRIVATE_KEY')}_${refreshToken}`,
              )
              .digest(),
          ),
        ),
      ),
    );
  }

  private encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(this.configService.get('JWT_PUBLIC_KEY') as string, 'hex'),
      iv,
    );
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([iv, encrypted, cipher.final()]);

    return encrypted;
  }

  private decrypt(buffer) {
    const iv = buffer.slice(0, 16);

    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(this.configService.get('JWT_PUBLIC_KEY') as string, 'hex'),
      iv,
    );

    let decrypted = decipher.update(buffer.slice(16, buffer.length));
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted;
  }

  private decryptAccessToken(token, key) {
    const message = Buffer.from(token, 'base64');
    const decipher = crypto.createDecipheriv(
      'aes-256-ecb',
      crypto
        .createHash('SHA256')
        .update(Buffer.concat([key, Buffer.from('_', 'utf-8')]))
        .digest(),
      '',
    );

    let decrypted = decipher.update(message);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString('utf-8');
  }
}
