import crypto from 'crypto'
import path from 'path'
import fs from 'fs'

export async function desencrypt(encrypt) {
  try {
    const privateKey = fs.readFileSync(path.join(__dirname, 'private.pem'), 'utf8')
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        passphrase: process.env.SECRET,
      },
      Buffer.from(encrypt, 'base64')
    )
    return decrypted.toString('utf8')

  } catch (error) {
    console.error('Error en desencrypt: ', error)
    return ''
  }
}
