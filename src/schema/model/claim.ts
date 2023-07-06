import { z }          from 'zod'
import { BaseSchema } from './base.js'

export type ClaimData     = z.infer<typeof data>
export type ClaimTemplate = z.infer<typeof template>

const { hash, pubkey, signature, str, timestamp } = BaseSchema

const content    = str,
      created_at = timestamp,
      id         = hash,
      sig        = signature

const template = z.object({ content }),
      preimage = template.extend({ pubkey, created_at }),
      data     = preimage.extend({ id, sig })

export const ClaimSchema = { data, preimage, template }
