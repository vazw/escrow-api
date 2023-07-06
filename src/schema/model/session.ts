import { z }          from 'zod'
import { BaseSchema } from './base.js'
import { TermSchema } from './terms.js'

export type SessionData = z.infer<typeof data>

const { hash, label, hex, script } = BaseSchema

const template = z.tuple([ label, hex ])

const data = z.object({
  secret    : hash,
  scripts   : script.array().optional(),
  taproot   : hash.optional(),
  templates : template.array().optional(),
  terms     : TermSchema.data.optional()
})

export const SessionSchema = { data }
