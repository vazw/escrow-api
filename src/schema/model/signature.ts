import { z }          from 'zod'
import { BaseSchema } from './base.js'

export type SignatureData     = z.infer<typeof data>
export type SignatureTemplate = z.infer<typeof template>

const { date, pubkey, hash } = BaseSchema

const template = z.object({
  hash,
  psig: hash
})

const data = template.extend({
  pubkey,
  updated_at: date
})

export const SignatureSchema = {
  data,
  template
}
