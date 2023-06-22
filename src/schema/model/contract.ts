import { z }               from 'zod'
import { BaseSchema }      from './base.js'
import { ClaimSchema }     from './claim.js'
import { DepositSchema }   from './deposit.js'
import { DetailSchema }    from './details.js'
import { EndorseSchema }   from './endorse.js'
import { MetaSchema }      from './meta.js'
import { ProfileSchema }   from './profile.js'
import { RecordSchema }    from './record.js'
import { ReturnSchema }    from './return.js'
import { SessionSchema }   from './session.js'
import { SignatureSchema } from './signature.js'
import { TxSchema }        from './transaction.js'

export type ContractData      = z.infer<typeof data>
export type ContractCreate    = z.infer<typeof create>

const { date, hash, pubkey } = BaseSchema

const status  = z.enum([ 'draft', 'published', 'active', 'disputed', 'closed' ]),
      members = pubkey.array()

const create = DetailSchema.template.extend({
  profile : ProfileSchema.template.optional(),
  records : RecordSchema.template.array().optional()
})

const data = z.object({
  contract_id  : hash,
  status,
  revision     : z.number(),
  created_at   : date,
  updated_at   : date,
  claims       : ClaimSchema.data.array(),
  deposits     : DepositSchema.data.array(),
  details      : DetailSchema.data,
  endorsements : EndorseSchema.data.array(),
  members,
  meta         : MetaSchema.data,
  profiles     : ProfileSchema.data.array(),
  records      : RecordSchema.data.array(),
  return       : ReturnSchema.data,
  session      : SessionSchema.data,
  signatures   : SignatureSchema.data.array(),
  transactions : TxSchema.data.array()
})

export const ContractSchema = {
  create,
  data,
  members
}
