import { z } from 'zod'
import { BaseSchema }   from '../base.js'
import { RecordSchema } from './record.js'

export type ProfileData     = z.infer<typeof data>
export type ProfileRecord   = z.infer<typeof record>
export type ProfileTemplate = z.infer<typeof template>

const { nonce, pubkey } = BaseSchema
const { template: record_template } = RecordSchema

const template = z.object({
  nonce,
  alias: z.string().min(2).max(32)
})

const data = template.extend({
  pubkey,
  updated_at: z.date()
})

const record = record_template.extend({
  type: z.literal('profile')
})

const label = record_template.shape.label

export const ProfileSchema = {
  data,
  label,
  record,
  template
}
