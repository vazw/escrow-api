import { z }          from 'zod'
import { BaseSchema } from './base.js'

export type ClaimData     = z.infer<typeof data>
export type ClaimTemplate = z.infer<typeof template>

const { date, nonce, pubkey, script } = BaseSchema

const template = z.object({
  address: z.string(),
  nonce
})

const data = template.extend({
  pubkey,
  script,
  updated_at: date
})

export const ClaimSchema = {
  data,
  template
}
