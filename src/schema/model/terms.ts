import { z }          from 'zod'
import { BaseSchema } from './base.js'

export type TermData     = z.infer<typeof data>
export type TermTemplate = z.infer<typeof template>
export type TermDetails  = z.infer<typeof details>
export type TermQuorum   = z.infer<typeof quorum>

const { address, entry, label, pubkey, timestamp, value } = BaseSchema

const feelabel = label.default('fee'),
      paylabel = label.default('payout'),
      retlabel = label.default('return'),
      payfee   = z.tuple([ value, address, feelabel ]),
      payout   = z.tuple([ value, address, paylabel ]),
      payret   = z.tuple([ value, address, retlabel ]),
      weight   = z.number().max(128).default(1),
      vote     = z.tuple([ pubkey, weight ]),
      members  = vote.array().default([]),
      size     = z.number(),
      fees     = payfee.array().default([]),
      payments = payout.array().default([]),
      returns  = payret.array().default([]),
      records  = entry.array().default([])

const details = z.object({
  duration : timestamp.default(0),
  expires  : timestamp.default(60 * 60 * 24 * 7), // 1 week
  grace    : timestamp.default(60 * 60 * 48),     // 2 days
  onclose  : paylabel,
  onexpire : retlabel,
  return   : address.optional()
})

const quorum = z.object({ members, size }).optional()

const template = z.object({
  details: details.partial(),
  fees,
  payments,
  quorum,
  records,
  returns
})

const data = template.extend({ pubkey })

export const TermSchema = { data, fees, template }
