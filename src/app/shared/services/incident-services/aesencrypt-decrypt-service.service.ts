import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AESEncryptDecryptServiceService {

//   PASSWORD = "gaDRq8MQPy";
//   SALT = "agaWyTFTMD"
//   Key_IV = "z6BZ0R3wVWYYGLN2"
  finalEncryption:any;
  constructor() { }
  encoder(str:any) {
    let encoder = new TextEncoder();
    let byteArray = encoder.encode(str)
    return CryptoJS.enc.Utf8.parse(str)
  }

  toWordArray(str:any) {
    return CryptoJS.enc.Utf8.parse(str);
  }

//   encrypt(value:any) {
//     var key = CryptoJS.PBKDF2(this.PASSWORD, this.SALT, {
//       keySize: 256 / 32,
//       iterations: 65536
//     })
//     var encrypted = CryptoJS.AES.encrypt(this.encoder(value), key, {
//       iv: this.toWordArray(this.Key_IV),
//       padding: CryptoJS.pad.Pkcs7,
//       mode: CryptoJS.mode.CBC
//     })
//     return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
//   }

  decrypt(value:any,password:any,salt:any,iv:any) {
    const decodedId = decodeURIComponent(value);
    var key = CryptoJS.PBKDF2(password, salt, {
      keySize: 256 / 32,
      iterations: 65536
    })
    var decrypted = CryptoJS.AES.decrypt(decodedId, key, {
      iv: this.toWordArray(iv),
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    })
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

}
