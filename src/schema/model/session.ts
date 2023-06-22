import { z }          from 'zod'
import { BaseSchema } from './base.js'

export type SessionData = z.infer<typeof data>

const { date, hash, hex, nonce, pubkey } = BaseSchema

const data = z.object({
  secret     : hash,
  pubkey     : pubkey.optional(),
  nonce      : nonce.optional(),
  sighash    : hash.optional(),
  txhex      : hex.optional(),
  taptweak   : hash.optional(),
  updated_at : date
})

export const SessionSchema = { data }
