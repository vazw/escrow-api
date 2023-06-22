import { z }          from 'zod'
import { BaseSchema } from './base.js'

export type ProfileData     = z.infer<typeof data>
export type ProfileTag      = z.infer<typeof entry>
export type ProfileTemplate = z.infer<typeof template>

const { entry, nonce, pubkey } = BaseSchema

const template = z.object({
  alias: z.string().min(2).max(32),
  nonce
})

const data = template.extend({
  pubkey,
  tags       : entry.array(),
  updated_at : z.date()
})

export const ProfileSchema = {
  data,
  tags: entry,
  template
}
