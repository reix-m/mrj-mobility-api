import { pbkdf2, randomBytes } from 'node:crypto';

export class Crypto {
  public static async hash(value: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = randomBytes(16).toString('hex');

      pbkdf2(value, salt, 1000, 64, 'sha512', function (error, buf) {
        if (error) {
          reject(error);
        }

        const hash = buf.toString('hex');

        resolve([salt, hash].join('$'));
      });
    });
  }

  public static async compare(passwordHash: string, value: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [salt, originalHash] = passwordHash.split('$');

      pbkdf2(value, salt, 1000, 64, 'sha512', function (error, buf) {
        if (error) {
          reject(error);
        }

        const hash: string = buf.toString('hex');
        resolve(hash === originalHash);
      });
    });
  }
}
