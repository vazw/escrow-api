import { z }          from 'zod'
import { BaseSchema } from './base.js'

export type RecordData     = z.infer<typeof data>
export type RecordQuery    = z.infer<typeof query>
export type RecordTemplate = z.infer<typeof template>

const { pubkey } = BaseSchema

const kind    = z.enum([ 'data', 'script' ]),
      label   = z.string().min(2).max(32),
      content = z.array(z.string())

const query = z.object({ label, pubkey, kind }).partial()

const template = z.object({ kind, label, content })

const data = template.extend({
  pubkey,
  updated_at: z.date()
})

export const RecordSchema = { query, template, data }
