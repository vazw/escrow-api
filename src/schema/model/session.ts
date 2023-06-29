import { z }          from 'zod'
import { BaseSchema } from './base.js'
import { TermSchema } from './terms.js'

export type SessionData = z.infer<typeof data>

const { hash, label, hex, nonce, pubkey, script } = BaseSchema

const template = z.tuple([ label, hex ])

const data = z.object({
  secret    : hash,
  pubkeys   : pubkey.array().default([]),
  nonces    : nonce.array().default([]),
  scripts   : script.array().default([]),
  sighash   : hash.optional(),
  taproot   : hash.optional(),
  templates : template.array().default([]),
  terms     : TermSchema.data.optional()
})

export const SessionSchema = { data }
