import { z }          from 'zod'
import { BaseSchema } from '../base.js'

export type ContractData     = z.infer<typeof data>
export type ContractTemplate = z.infer<typeof template>

const { hash, hex } = BaseSchema

const status = z.enum([ 'draft', 'published', 'active', 'disputed', 'closed' ]),
      agent       = hash,
      member      = hash,
      members     = member.array(),
      description = z.string().max(2048),
      signature   = hex

const template = z.object({
  description,
  agent   : agent.optional(),
  members : members.optional()
})

const ref = z.object({
  contract_id : hash,
  updated_at  : z.date()
})

const data = z.object({
  info: z.object({
    description,
    admin : hash,
    agent : hash
  }),
  meta: z.object({
    block_id   : hash,
    open_txid  : z.union([ hash, z.null() ]),
    close_txid : z.union([ hash, z.null() ])
  }),
  room: z.object({
    secret : hash,
    nonce  : z.union([ hash, z.null() ]),
    pubkey : z.union([ hash, z.null() ]),
    hash   : z.union([ hash, z.null() ])
  }),
  status,
  members,
  contract_id : hash,
  revision    : z.number(),
  created_at  : z.date(),
  updated_at  : z.date()
})

export const ContractSchema = {
  data,
  members,
  ref,
  signature,
  template
}
