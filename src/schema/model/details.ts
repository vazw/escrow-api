import { z }          from 'zod'
import { BaseSchema } from './base.js'

export type ContractDetails  = z.infer<typeof data>
export type ContractTemplate = z.infer<typeof template>

const { pubkey, value } = BaseSchema

const description = z.string().max(2048),
      terms       = z.string().max(2048),
      title       = z.string().max(64)

const template = z.object({
  title,
  description : description.optional(),
  terms       : terms.optional(),
  agent       : pubkey.optional(),
  depositor   : pubkey.optional(),
  value
})

const data = z.object({
  title,
  description,
  terms,
  admin     : pubkey,
  agent     : pubkey,
  depositor : pubkey,
  value
})

export const DetailSchema = { data, template }
