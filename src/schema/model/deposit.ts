import { z }          from 'zod'
import { BaseSchema } from './base.js'

export type DepositData = z.infer<typeof data>

const { date, hash, value } = BaseSchema

const data = z.object({
  txid       : hash,
  vout       : z.number(),
  value,
  updated_at : date
})

export const DepositSchema = { data }
