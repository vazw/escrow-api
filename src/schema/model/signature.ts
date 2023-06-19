import { z }          from 'zod'
import { BaseSchema } from '../base.js'

export type SignatureData = z.infer<typeof data>

const { hash, hex } = BaseSchema

const data = z.object({
  contract_id : hash,
  pubkey      : hash,
  kind        : z.enum([ 'vote', 'musig' ]),
  id          : hash,
  sig         : hex.max(256),
  updated_at  : z.date()
})

export const SigSchema = { data }
