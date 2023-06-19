import { z } from 'zod'
import { BaseSchema } from '../base.js'

export type ProfileData = z.infer<typeof data>
export type ProfileTag  = z.infer<typeof tag>
export type ProfileTemplate = z.infer<typeof template>

const { hash, signature, timestamp } = BaseSchema

const tag  = z.string().array()
const tags = z.array(tag)

const template = z.object({
  alias : z.string(),
  nonce : z.string()
})

const data = z.object({
  tags,
  contract_id : hash,
  pubkey      : hash,
  content     : template,
  id          : hash,
  sig         : signature,
  created_at  : timestamp
})

export const ProfileSchema = {
  data,
  template,
  tags
}
