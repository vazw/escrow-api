import { z }          from 'zod'
import { BaseSchema } from './base.js'

export type SignatureData     = z.infer<typeof data>
export type SignatureTemplate = z.infer<typeof template>

const { label, pubkey, hash } = BaseSchema

const template = z.object({
  kind : label,
  hash,
  psig : hash,
  pubkey
})

const data = template.extend({ pubkey })

export const SignatureSchema = { data, template }
