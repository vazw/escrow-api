import { z }          from 'zod'
import { BaseSchema } from './base.js'
import { TermSchema } from './terms.js'

export type AgentData = z.infer<typeof data>

const { pubkey, nonce } = BaseSchema
const { fees }          = TermSchema

const data = z.object({ nonce, pubkey, fees })

export const AgentSchema = { data }
