import { z }          from 'zod'
import { BaseSchema } from '../base.js'

export type ContractData     = z.infer<typeof data>
export type ContractTemplate = z.infer<typeof template>

const { hash } = BaseSchema

const status  = z.enum([ 'draft', 'published', 'active', 'disputed', 'closed' ]),
      members = z.array(hash),
      description = z.string().max(2048)

const template = z.object({
  description,
  agent   : hash.optional(),
  members : members.optional()
})

const ref = z.object({
  contract_id : hash,
  updated_at  : z.date()
})

const data = z.object({
  info: z.object({
    description,
    agent : hash,
    admin : hash
  }),
  meta: z.object({
    block_id   : hash,
    room_nonce : hash,
    room_pub   : z.union([ hash, z.null() ]),
    tap_root   : z.union([ hash, z.null() ]),
    open_txid  : z.union([ hash, z.null() ]),
    close_txid : z.union([ hash, z.null() ])
  }),
  members,
  status,
  id         : hash,
  revision   : z.number(),
  created_at : z.date(),
  updated_at : z.date()
})

export const ContractSchema = { data, ref, template }
