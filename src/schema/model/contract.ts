import { z }               from 'zod'
import { AgentSchema }     from './agent.js'
import { BaseSchema }      from './base.js'
import { ClaimSchema }     from './claim.js'
import { DepositSchema }   from './deposit.js'
import { ProposalSchema }  from './proposal.js'
import { SessionSchema }   from './session.js'
import { TxSchema }        from './transaction.js'

export type ContractCreate   = z.infer<typeof create>
export type ContractData     = z.infer<typeof data>
export type ContractTemplate = z.infer<typeof template>

const { hash, pubkey, timestamp, value } = BaseSchema

const desc    = z.string().max(2048),
      feerate = z.number(),
      access  = pubkey.array(),
      network = z.enum([ 'bitcoin', 'testnet', 'regtest' ]),
      status  = z.enum([ 'draft', 'published', 'active', 'disputed', 'closed' ]),
      title   = z.string().max(64)

const template = z.object({
  title,
  desc,
  feerate,
  network,
  value
})

const create = template.merge(ProposalSchema.template).extend({ access })

const base = z.object({
  status,
  access,
  contract_id : hash,
  admin       : pubkey,
  created_at  : timestamp,
  updated_at  : timestamp
})

const data = base.extend({
  agent        : AgentSchema.data,
  claims       : ClaimSchema.data.array(),
  deposits     : DepositSchema.data.array(),
  info         : template,
  proposals    : ProposalSchema.data.array(),
  session      : SessionSchema.data,
  transactions : TxSchema.data.array()
})

export const ContractSchema = {
  create,
  data,
  access,
  template
}
