// import { Buff, Bytes } from '@cmdcode/buff-utils'
// import { verify }      from '@cmdcode/crypto-utils'
// import { now }         from './utils.js'

// import {
//   ProposalData,
//   ProposalPreimage,
//   ProposalTemplate,
//   ProposalSchema,
//   SignerAPI,
//   TermSchema,
//   TermTemplate
// } from '../schema/index.js'

// export function taghash (
//   tag      : string,
//   ...bytes : Bytes[]
// ) : string {
//   const hash = Buff.str(tag).digest
//   return Buff.join([ hash, hash, ...bytes ]).digest.hex
// }

// export function hash_terms (
//   terms : TermTemplate
// ) : Buff {
//   const schema  = TermSchema.template
//   const parsed  = schema.parse(terms)
//   const message = JSON.stringify(parsed)
//   return Buff.str(message).digest
// }

// export function hash_proposal (
//   proposal : ProposalPreimage
// ) : string {
//   const schema = ProposalSchema.preimage
//   const parsed = schema.parse(proposal)
//   const entries = Object
//     .entries(parsed)
//     .map(e => JSON.stringify(e))
//     .sort()
//   const message = JSON.stringify(entries)
//   return taghash('escrow/proposal', Buff.str(message))
// }

// export function sign_proposal (
//   proposal : ProposalTemplate,
//   pubkey   : string,
//   signer   : SignerAPI
// ) : ProposalData {
//   const pre = { ...proposal, pubkey, created_at: now() }
//   const id  = hash_proposal(pre)
//   const sig = signer.sign(id)
//   return { id, sig, ...pre }
// }

// export function verify_proposal (
//   proposal : ProposalData
// ) : boolean {
//   const { id, sig, ...rest } = proposal
//   const pub  = proposal.pubkey
//   const test = hash_proposal(rest)
//   return (id !== test) || verify(sig, id, pub)
// }

export {}
