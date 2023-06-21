import { z }               from 'zod'
import { BaseSchema }      from '../base.js'
import { ProfileSchema }   from './profile.js'
import { RecordSchema }    from './record.js'
import { EndorseSchema }   from './endorse.js'
import { SignatureSchema } from './signature.js'

export type ContractData      = z.infer<typeof data>
export type ContractCreate    = z.infer<typeof create>
export type ContractTemplate  = z.infer<typeof template>

const { hash, nonce, pubkey } = BaseSchema
const { data: endorsement }   = EndorseSchema
const { data: profile }       = ProfileSchema
const { data: record  }       = RecordSchema
const { data: signature }     = SignatureSchema

const status      = z.enum([ 'draft', 'published', 'active', 'disputed', 'closed' ]),
      members     = pubkey.array(),
      description = z.string().max(2048),
      title       = z.string().max(64),
      terms       = z.string().max(2048)

const template = z.object({
  title,
  description : description.optional(),
  terms       : terms.optional(),
  agent       : pubkey.optional()
})

const create = template.extend({
  profile : ProfileSchema.template.optional(),
  records : RecordSchema.template.array().optional()
})

const data = z.object({
  info: z.object({
    title,
    description : description.optional(),
    terms       : terms.optional(),
    admin       : pubkey,
    agent       : pubkey
  }),
  meta: z.object({
    block_id   : hash,
    open_txid  : hash.optional(),
    close_txid : hash.optional()
  }),
  room: z.object({
    secret : hash,
    nonce  : nonce.optional(),
    pubkey : pubkey.optional(),
    hash   : hash.optional()
  }),
  status,
  members,
  contract_id  : hash,
  revision     : z.number(),
  created_at   : z.date(),
  updated_at   : z.date(),
  endorsements : endorsement.array(),
  profiles     : profile.array(),
  records      : record.array(),
  signatures   : signature.array(),
  transactions : hash.array()
})

export const ContractSchema = {
  create,
  data,
  members,
  endorsement,
  signature,
  template
}
