import * as crypto from 'crypto';
import jwtDecode from 'jwt-decode';
import { when } from 'jest-when';
import { AdminStrategy } from './admin.strategy';
import { AuthenticationException } from '../../../exceptions/authentication.exception';
import { hoUrl, url } from '../../../handlebars-helpers/url';

const createHash = {
  update: jest.fn(),
};
const createHashDigestWrap = (v) => ({
  digest: () => v,
});

jest.mock('crypto', () => ({
  createHash: jest.fn(),
  randomBytes: jest.fn(),
  createCipheriv: jest.fn(),
  createDecipheriv: jest.fn(),
}));

jest.mock('jwt-decode', () => ({
  default: jest.fn(),
}));

jest.mock('../../../handlebars-helpers/url', () => ({
  hoUrl: jest.fn(),
  url: jest.fn(),
}));

describe('AdminStrategy', () => {
  const accessToken = 'accessToken';
  const refreshToken = 'refreshToken';

  const hashedRefreshToken = 'hashedRefreshToken';

  const configService = {
    get: jest.fn(),
  } as any;
  const JWT_PRIVATE_KEY = 'JWT_PRIVATE_KEY';
  const JWT_PUBLIC_KEY = 'JWT_PUBLIC_KEY';

  async function business(req) {
    // private key + refresh token 을 sha256으로 해싱 -- (a)
    when<any, any>(crypto.createHash)
      .calledWith('SHA256')
      .mockReturnValue(createHash);
    when(createHash.update)
      .calledWith(`${JWT_PRIVATE_KEY}_${refreshToken}`)
      .mockReturnValue(createHashDigestWrap(hashedRefreshToken));

    // (a) 를 aes-256-cbc 알고리즘으로 암호화 -- (b)
    const iv = Buffer.from('0000000000000000');
    const cipher = {
      update: jest.fn(),
      final: jest.fn(),
    };
    const encrypted = Buffer.from('encrypted', 'utf-8');
    const encryptedFinal = Buffer.from('final', 'utf-8');

    when<Buffer, [number]>(crypto.randomBytes)
      .calledWith(16)
      .mockReturnValue(iv);
    when<any, any>(crypto.createCipheriv)
      .calledWith('aes-256-cbc', Buffer.from(JWT_PUBLIC_KEY, 'hex'), iv)
      .mockReturnValue(cipher);
    when(cipher.update)
      .calledWith(hashedRefreshToken)
      .mockReturnValue(encrypted);
    when(cipher.final).mockReturnValue(encryptedFinal);

    // (b) 를 aes-256-bcb 알고리즘으로 복호화 -- (c)
    const decipher = {
      update: jest.fn(),
      final: jest.fn(),
    };
    const decrypted = Buffer.from('decrypted', 'utf-8');
    const decryptedFinal = Buffer.from('decryptedFinal', 'utf-8');
    when<any, any>(crypto.createDecipheriv)
      .calledWith('aes-256-cbc', Buffer.from(JWT_PUBLIC_KEY, 'hex'), iv)
      .mockReturnValue(decipher);
    when(decipher.update)
      .calledWith(Buffer.concat([encrypted, encryptedFinal]))
      .mockReturnValue(decrypted);
    when(decipher.final).mockReturnValue(decryptedFinal);

    // (c) 를 사용하여 access token 을 aes-256-ecb 알고리즘으로 복호화
    const hashedDecrypted = 'hashedDecrypted';
    const accessTokenDecipher = {
      update: jest.fn(),
      final: jest.fn(),
    };
    const accessTokenDecrypted = Buffer.from('accessTokenDecrypted', 'utf-8');
    const accessTokenFinal = Buffer.from('accessTokenFinal', 'utf-8');

    when<any, any>(crypto.createHash)
      .calledWith('SHA256')
      .mockReturnValue(createHash);
    when(createHash.update)
      .calledWith(
        Buffer.concat([decrypted, decryptedFinal, Buffer.from('_', 'utf-8')]),
      )
      .mockReturnValue(createHashDigestWrap(hashedDecrypted));
    when<any, any>(crypto.createDecipheriv)
      .calledWith('aes-256-ecb', hashedDecrypted, '')
      .mockReturnValue(accessTokenDecipher);
    when(accessTokenDecipher.update)
      .calledWith(Buffer.from(accessToken, 'base64'))
      .mockReturnValue(accessTokenDecrypted);
    when(accessTokenDecipher.final).mockReturnValue(accessTokenFinal);

    // jwt decode
    const jwt = {
      id: 'id',
      aud: 'aud',
      sub: 'user id',
      exp: 1671756470,
      iat: 1671755270,
      token_type: 'bearer',
      scope: 'scope',
    };
    when(jwtDecode)
      .calledWith(
        Buffer.concat([accessTokenDecrypted, accessTokenFinal]).toString(
          'utf-8',
        ),
      )
      .mockReturnValue(jwt);

    const strategy = new AdminStrategy(configService);
    const result = await strategy.validate(req as any);

    expect(result).toBe(jwt);
  }

  beforeEach(() => {
    jest.clearAllMocks();

    when(configService.get)
      .calledWith('JWT_PRIVATE_KEY')
      .mockReturnValue(JWT_PRIVATE_KEY);

    when(configService.get)
      .calledWith('JWT_PUBLIC_KEY')
      .mockReturnValue(JWT_PUBLIC_KEY);
  });

  it('header 에 저장', async () => {
    // request 세팅
    const req = {
      header: jest.fn(),
    };
    when(req.header).calledWith('biz_atk').mockReturnValue(accessToken);
    when(req.header).calledWith('biz_rtk').mockReturnValue(refreshToken);

    await business(req);
  });

  it('cookie 에 저장', async () => {
    // request 세팅
    const req = {
      header: jest.fn(),
      cookies: {
        biz_atk: accessToken,
        biz_rtk: refreshToken,
      },
    };
    when(req.header).calledWith('biz_atk').mockReturnValue(null);
    when(req.header).calledWith('biz_rtk').mockReturnValue(null);

    await business(req);
  });

  it('token 없음', async () => {
    const req = {
      header: jest.fn(),
      cookies: {},
    };

    when(req.header).calledWith('biz_atk').mockReturnValue(null);
    when(req.header).calledWith('biz_rtk').mockReturnValue(null);

    when(hoUrl).mockReturnValue('ho-url');
    when(url).mockReturnValue('url');

    const strategy = new AdminStrategy(configService);

    await expect(async () => {
      await strategy.validate(req as any);
    }).rejects.toThrowError(AuthenticationException);
  });
});
