import * as nacl from 'tweetnacl';
import * as naclUtil from 'tweetnacl-util';

declare let window: any

export function isNullish(value: any) {
  return value === null || value === undefined;
}

export function encrypt(data: string, publicKey: string, version: string): string {
  // return data
  if (isNullish(publicKey)) {
    throw new Error('Missing publicKey parameter');
  } else if (isNullish(data)) {
    throw new Error('Missing data parameter');
  } else if (isNullish(version)) {
    throw new Error('Missing version parameter');
  }

  switch (version) {
    case 'x25519-xsalsa20-poly1305': {
      // generate ephemeral keypair
      const ephemeralKeyPair = nacl.box.keyPair();

      // assemble encryption parameters - from string to UInt8
      let pubKeyUInt8Array;
      try {
        pubKeyUInt8Array = naclUtil.decodeBase64(publicKey);
      } catch (err) {
        throw new Error('Bad public key');
      }

      const msgParamsUInt8Array = naclUtil.decodeUTF8(data);
      const nonce = nacl.randomBytes(nacl.box.nonceLength);

      // encrypt
      const encryptedMessage = nacl.box(
        msgParamsUInt8Array,
        nonce,
        pubKeyUInt8Array,
        ephemeralKeyPair.secretKey,
      );

      // handle encrypted data
      const output = {
        version: 'x25519-xsalsa20-poly1305',
        nonce: naclUtil.encodeBase64(nonce),
        ephemPublicKey: naclUtil.encodeBase64(ephemeralKeyPair.publicKey),
        ciphertext: naclUtil.encodeBase64(encryptedMessage),
      };
      // return encrypted msg data
      return JSON.stringify(output);
    }
    default:
      throw new Error('Encryption type/version not supported');
  }
}

export async function decrypt(data: string, version: string): Promise<string> {
  const my_data = data
  let accounts = await window.ethereum.request({method: 'eth_accounts'});
  return await window.ethereum.request({method: 'eth_decrypt', params: [my_data, accounts[0]]})
}

