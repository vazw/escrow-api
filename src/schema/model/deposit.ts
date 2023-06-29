import { z }          from 'zod'
import { BaseSchema } from './base.js'

export type DepositData     = z.infer<typeof data>
export type DepositTemplate = z.infer<typeof template>

const { address, hash, value } = BaseSchema

const template = z.object({ address, value }).partial()

const data = z.object({
  address,
  value,
  txid : hash,
  vout : z.number()
})

export const DepositSchema = { data, template }
