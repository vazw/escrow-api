import { z }          from 'zod'
import { BaseSchema } from './base.js'

export type EndorseData     = z.infer<typeof data>
export type EndorseTemplate = z.infer<typeof template>

const { pubkey, signature, hash } = BaseSchema

const template = z.object({ hash, signature })

const data = template.extend({
  pubkey,
  updated_at: z.date()
})

export const EndorseSchema = {
  data,
  template
}
