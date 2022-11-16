import * as bcrypt from 'bcrypt';
import { when } from 'jest-when';
import { hash, isMatch } from './cipher';

jest.mock('bcrypt');

describe('cipher', () => {
  const text = 'text',
    hashed = 'hashed';

  it('hash', async () => {
    when(bcrypt.hashSync).calledWith(text, 10).mockReturnValueOnce(hashed);

    const result = await hash(text);

    expect(result).toBe(hashed);
  });

  it('isMatch', async () => {
    when(bcrypt.compareSync).calledWith(text, hashed).mockReturnValueOnce(true);

    const result = await isMatch(text, hashed);

    expect(result).toBe(true);
  });
});
