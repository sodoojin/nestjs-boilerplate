import * as bcrypt from 'bcrypt';

export async function hash(text: string) {
  return bcrypt.hashSync(text, 10);
}

export async function isMatch(text: string, hashed: string) {
  return bcrypt.compareSync(text, hashed);
}
