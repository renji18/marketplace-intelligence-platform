import * as argon2 from 'argon2';

const argon2Options = {
  type: argon2.argon2id,
  memoryCost: 4096, // 4MB memory default 64MB
  timeCost: 2, // 2 iterations default 3-10
  parallelism: 1, // 1 thread vs default 4
  hashLength: 32, // 32 byte hash
};

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password, argon2Options);
}

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return await argon2.verify(hashedPassword, plainPassword);
}

export function generateTempPassword(length = 10): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!&*';
  let password = '';

  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
}

export function generateOTP(): string {
  const length = 6;
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}
