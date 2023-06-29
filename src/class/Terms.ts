// import { ProfileRouter }  from '../routes/propose.js'
// import { EscrowContract } from './Contract.js'

// import {
//   ProposalData,
//   ProposalTemplate,
// } from '../schema/index.js'

// export class TermController {
//   readonly _contract : EscrowContract

//   constructor (
//     contract : EscrowContract
//   ) {
//     this._contract = contract
//   }

//   get API () : ProfileRouter {
//     return this._contract._client.API.proposal
//   }

//   get id () : string {
//     return this._contract.id
//   }

//   get pubkey () : string {
//     return this._contract._client.pubkey
//   }

//   get data () : Promise<ProposalData | undefined> {
//     return this.list().then(e => e.find(p => p.pubkey === this.pubkey))
//   }

//   get details () : Promise<Partial<TermsDetails>[]> {
//     return this._getDetails()
//   }

//   get fees () : Promise<PayoutData[]> {
//     return this._getFees()
//   }

//   get payments () : Promise<PayoutData[]> {
//     return this._getPayments()
//   }

//   get records () : Promise<RecordData[]> {
//     return this._getRecords()
//   }

//   get returns () : Promise<PayoutData[]> {
//     return this._getPayments()
//   }


//   async refresh () {
//     return this._contract.fetch()
//   }

//   async list () : Promise<ProposalData[]> {
//     return this._contract.data.then(e => e.proposals)
//   }

//   async update (template : ProposalTemplate) {
//     const res = await this.API.update(this.id, template)
//     if (!res.ok) throw new Error(res.err)
//     return this.refresh().then(() => this.data)
//   }

//   async remove () {
//     const res = await this.API.remove(this.id)
//     if (!res.ok) throw new Error(res.err)
//     return this.refresh().then(() => this.data)
//   }

//   async _getDetails () : Promise<Partial<DetailData>[]> {
//     const details : Partial<DetailData>[] = []
//     const props = await this._contract.proposals

//     props.forEach(({ pubkey, terms }) => {
//       details.push({ ...terms.details, pubkey })
//     })

//     return details
//   }

//   async _getFees () : Promise<PayoutData[]> {
//     const fees : PayoutData[] = []
//     const agent = await this._contract.agent
//     const props = await this._contract.proposals

//     agent.fees.forEach(e => { 
//       fees.push({ ...e, pubkey: agent.pubkey })
//     })

//     props.forEach(({ pubkey, terms }) => {
//       terms.fees.forEach(e => {
//         fees.push({ ...e, pubkey })
//       })
//     })

//     return fees
//   }

//   async _getPayments () : Promise<PayoutData[]> {
//     const payments : PayoutData[] = []
//     const props = await this._contract.proposals

//     props.forEach(({ pubkey, terms }) => {
//       terms.payments.forEach(e => {
//         payments.push({ ...e, pubkey })
//       })
//     })

//     return payments
//   }

//   async _getRecords () : Promise<RecordData[]> {
//     const records : RecordData[] = []
//     const props = await this._contract.proposals

//     props.forEach(({ pubkey, terms }) => {
//       terms.records.forEach(e => {
//         records.push({ ...e, pubkey })
//       })
//     })

//     return records
//   }

//   // async clear () {
//   //   const res = await this.API. (this.cid, members)
//   //   if (!res.ok) throw new Error(res.err)
//   //   this.refresh().then(e => e.members)
//   // }

// }

export {}
