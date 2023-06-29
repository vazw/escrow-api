// import { TermData, TermSchema, TermTemplate } from '../schema/index.js'

import { Buff } from '@cmdcode/buff-utils'

export const now = () => Math.floor(Date.now() / 1000)

export const buffer = Buff

// interface Consensus {
//   pubkey   : string
//   details  : [ string, string ][]
//   fees     : [ string, string ][]
//   payments : [ string, string ][]
//   quorum   : [ string, string ][]
//   records  : [ string, string ][]
//   returns  : [ string, string ][]
// }

// export function stringify_terms (terms : TermTemplate) {
//   return Object.entries(terms).map(e => [ e[0], JSON.stringify(e[1]) ])
// }

// export function aggregate_terms (terms : TermData[]) {
//   const reports : Consensus[] = []

//   for (const raw of terms) {
//     const term = TermSchema.data.parse(raw)
//     const { pubkey: self_key, ...self } = term

//     const report : Consensus = {
//       pubkey   : self_key,
//       details  : [],
//       fees     : [],
//       payments : [],
//       quorum   : [],
//       records  : [],
//       returns  : []
//     }

//     const others = terms.filter(e => e.pubkey !== self_key)

//     for (const o of others) {
//       const { pubkey: other_key, ...other } = o
//       const entries = Object.entries(other)
//       for (const [ k, v ] of entries) {
//         const a = JSON.stringify(self[k]),
//               b = JSON.stringify(v)
//         if (a !== b) {
//           console.log('mismatch:', a, b)
//           report[k].push(other_key)
//         }
//       }
//     }
//     reports.push(report)
//   }

//   return reports
// }
