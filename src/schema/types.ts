import { Bytes } from '@cmdcode/buff-utils'

export type Fetcher = (signer : SignerAPI) => typeof fetch
export type ResponseAPI<T = any> = PassResponse<T> | FailResponse

export interface SignerAPI {
  // Provides the public key for the signer.
  pubkey   : string
  // Generate a new Signer using an HMAC plus seed.
  generate : (seed : Bytes)  => SignerAPI
  // Perform an HMAC signing operation.
  hmac     : (msg : Bytes)  => string
  // Produce a partial musig2 signature.
  musign   : (challenge : Bytes, nonces : Bytes[], vectors : Bytes[]) => string
  // Produce a random cryptographic seed.
  random   : (size ?: number) => string
  // Produce a BIP0340 signature using the interal secret.
  sign     : (msg   : Bytes)  => string
  // Verify a BIP0340 signature and pubkey.
  verify   : (sig : Bytes, msg : Bytes, pub : Bytes) => boolean
}

interface PassResponse<T> {
  ok   : true
  data : T
}

interface FailResponse {
  ok    : false
  data ?: any
  err   : string
}
