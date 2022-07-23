import { scrypt, randomBytes } from "crypto"
import { promisify } from "util"

const scryptAsync = promisify(scrypt)

export class PasswordManager {
  static async encrypt(string: string): Promise<string> {
    const salt = randomBytes(32).toString("hex")
    const _buffer = (await scryptAsync(string, salt, 64)) as Buffer

    return `${_buffer.toString("hex")}.${salt}`
  }

  static addMinutesToDate(date: Date, minutes: number) {
    return new Date(date.getTime() + minutes * 60000)
  }

  static async compare(
    storedValue: string,
    suppliedSupplied: string
  ): Promise<boolean> {
    const [hashedPassword, salt] = storedValue.split(".")
    const _buffer = (await scryptAsync(suppliedSupplied, salt, 64)) as Buffer

    return _buffer.toString("hex") === hashedPassword
  }
}
