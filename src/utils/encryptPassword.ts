import * as crypto from "crypto";

function encryptPassword(password: string, cryptoSalt: string) {
  return crypto.pbkdf2Sync(
    password, cryptoSalt, 10000, 64, 'sha512'
  ).toString('base64');
}

export default encryptPassword;