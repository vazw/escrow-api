import { z }          from 'zod'
import { BaseSchema } from '../base.js'

export type RecordData     = z.infer<typeof data>
export type RecordQuery    = z.infer<typeof query>
export type RecordTemplate = z.infer<typeof template>

const { hash } = BaseSchema

const kind    = z.enum([ 'data', 'param', 'script' ]),
      label   = z.string().max(64),
      content = z.array(z.string()),
      query   = z.object({ kind, label })

const template = z.object({ kind, label, content })

const data = template.extend({
  contract_id : hash,
  updated_at  : z.date()
})

export const RecordSchema = { query, template, data }
