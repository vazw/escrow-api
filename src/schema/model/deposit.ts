import { z }          from 'zod'
import { BaseSchema } from './base.js'

export type DepositData     = z.infer<typeof data>
export type DepositTemplate = z.infer<typeof template>

const { address, bool, hash, index, label, signature, value } = BaseSchema

const refund     = address,
      signatures = z.tuple([ label, signature ]).array()

const template = z.object({ refund, signatures, value })

const data = template.extend({
  address,           // Prevout address for the deposit.
  confirmed : bool,  // If deposit txid is confirmed.
  txid      : hash,  // Transaction ID of deposit utxo.
  vout      : index  // Output index of deposit utxo.
})

export const DepositSchema = { data, template }
