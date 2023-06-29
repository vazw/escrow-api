import { z }          from 'zod'
import { BaseSchema } from './base.js'

export type TransactionData = z.infer<typeof data>

const { hash, hex, timestamp } = BaseSchema

const data = z.object({
  confirmed  : z.boolean(),
  kind       : z.enum([ 'deposit', 'spend' ]),
  txid       : hash,
  txdata     : hex,
  updated_at : timestamp
})

export const TxSchema = { data }
