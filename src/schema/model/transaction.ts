import { z }          from 'zod'
import { BaseSchema } from './base.js'

export type TransactionData = z.infer<typeof data>

const { date, hash, hex } = BaseSchema

const data = z.object({
  confirmed  : z.boolean(),
  type       : z.enum([ 'claim', 'deposit', 'refund', 'settlement' ]),
  txid       : hash,
  txhex      : hex,
  updated_at : date
})

export const TxSchema = { data }
