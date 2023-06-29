import { z }               from 'zod'
import { AgentSchema }     from './agent.js'
import { BaseSchema }      from './base.js'
import { DepositSchema }   from './deposit.js'
import { ProposalSchema }  from './proposal.js'
import { SessionSchema }   from './session.js'
import { SignatureSchema } from './signature.js'
import { TxSchema }        from './transaction.js'

export type ContractCreate   = z.infer<typeof create>
export type ContractData     = z.infer<typeof data>
export type ContractTemplate = z.infer<typeof template>

const { hash, pubkey, timestamp, value } = BaseSchema

const desc    = z.string().max(2048).default(''),
      feerate = z.number().default(1),
      members = pubkey.array().default([]),
      network = z.enum([ 'bitcoin', 'testnet', 'regtest' ]).default('bitcoin'),
      hidden  = z.boolean().default(true),
      status  = z.enum([ 'draft', 'published', 'active', 'disputed', 'closed' ]),
      title   = z.string().max(64)

const template = z.object({
  title,
  desc,
  feerate,
  network,
  private: hidden,
  value
})

const create = template.merge(ProposalSchema.template).extend({ members })

const base = z.object({
  status,
  members,
  contract_id : hash,
  admin       : pubkey,
  created_at  : timestamp,
  updated_at  : timestamp
})

const data = base.extend({
  agent        : AgentSchema.data,
  deposits     : DepositSchema.data.array().default([]),
  proposals    : ProposalSchema.data.array().default([]),
  info         : template,
  session      : SessionSchema.data,
  signatures   : SignatureSchema.data.array().default([]),
  transactions : TxSchema.data.array().default([])
})

export const ContractSchema = {
  create,
  data,
  members,
  template
}
