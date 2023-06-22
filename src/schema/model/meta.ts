import { z }          from 'zod'
import { BaseSchema } from './base.js'

export type ContractMeta  = z.infer<typeof data>

const { hash } = BaseSchema

const data = z.object({
  block_id   : hash,
  open_txid  : hash.optional(),
  close_txid : hash.optional()
})

export const MetaSchema = { data }
