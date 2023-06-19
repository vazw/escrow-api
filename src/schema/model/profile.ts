import { z } from 'zod'
import { BaseSchema } from '../base.js'

export type ProfileData = z.infer<typeof data>
export type ProfileTemplate = z.infer<typeof template>

const { entries, hash, signature, timestamp } = BaseSchema

const template = z.object({
  alias: z.string()
})

const data = z.object({
  contract_id : hash,
  pubkey      : hash,
  content     : z.object({
    alias: z.string()
  }),
  tags       : entries,
  id         : hash,
  sig        : signature,
  created_at : timestamp
})

export const ProfileSchema = {
  data,
  template
}
