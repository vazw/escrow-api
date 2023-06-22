import { z }          from 'zod'
import { BaseSchema } from './base.js'

export type ReturnData = z.infer<typeof data>

const { bech32, date, script } = BaseSchema

const data = z.object({
  address    : bech32,
  expires    : z.number(),
  script,
  updated_at : date
})

export const ReturnSchema = { data }
