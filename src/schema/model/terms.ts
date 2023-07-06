import { z }          from 'zod'
import { BaseSchema } from './base.js'

export type TermData      = z.infer<typeof data>
export type TermLocks     = z.infer<typeof locks>
export type TermQuorum    = z.infer<typeof quorum>
export type TermSchedule  = z.infer<typeof schedule>
export type TermTemplate  = z.infer<typeof template>

const { address, entry, hash, label, pubkey, timestamp, value } = BaseSchema

const payment   = z.tuple([ label, value, address ]),
      fees      = payment.array(),
      paths     = payment.array(),
      records   = entry.array()

const claims = z.object({
  mediator : pubkey,
  members  : pubkey.array()
}).optional()

// Locks enable a payment to be released
// early, based on the reveal of a secret.
const locks  = z.tuple([ label, hash ]).array().optional()

// A quorum enables a payment to be released
// early, based on a collection of signatures.
const quorum = z.object({
  members   : pubkey.array(),
  threshold : z.number()
}).optional()

const schedule = z.object({
  duration  : timestamp,  // Duration to hold contract open.
  expires   : timestamp,  // Expiration of contract.
  grace     : timestamp,  // Grace period between contract and deposit expiration.
  onclose   : label,      // Payment action on close.
  onexpired : label       // Payment action on contract expiration.
})

const template = z.object({
  claims,
  fees,
  locks,
  quorum,
  paths,
  records,
  schedule
})

const data = template.extend({ hash })

export const TermSchema = {
  claims,
  data,
  fees,
  locks,
  paths,
  quorum,
  schedule,
  template
}
