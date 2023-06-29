import { z }          from 'zod'
import { BaseSchema } from './base.js'
import { TermSchema } from './terms.js'

export type ProposalData     = z.infer<typeof data>
export type ProposalPreimage = z.infer<typeof preimage>
export type ProposalTemplate = z.infer<typeof template>

const now = () => Math.floor(Date.now() / 1000)

const { hash, label, nonce, pubkey, signature, timestamp } = BaseSchema

const terms = TermSchema.data

const alias      = label,
      id         = hash,
      sig        = signature,
      created_at = timestamp.default(now())

const template = z.object({ alias, nonce, terms }),
      preimage = template.extend({ pubkey, created_at }),
      data     = preimage.extend({ id, sig })

export const ProposalSchema = {
  data,
  preimage,
  template
}
