import { EscrowContract } from './Contract.js'
import { ProfileRouter }  from '../routes/propose.js'

import {
  ProposalData,
  ProposalTemplate
} from '../schema/index.js'

export class ProposalController {
  readonly _contract : EscrowContract

  constructor (
    contract : EscrowContract,
  ) {
    this._contract = contract
  }

  get API () : ProfileRouter {
    return this._contract._client.API.proposal
  }

  get id () : string {
    return this._contract.id
  }

  get pubkey () : string {
    return this._contract.signer.pubkey
  }

  get data () : Promise<ProposalData | undefined> {
    return this.list().then(e => e.find(p => p.pubkey === this.pubkey))
  }

  async refresh () {
    return this._contract.fetch()
  }

  async list () : Promise<ProposalData[]> {
    return this._contract.data.then(e => e.proposals)
  }

  async update (template : ProposalTemplate) {
    const res = await this.API.update(this.id, template)
    if (!res.ok) throw new Error(res.err)
    return this.refresh().then(() => this.data)
  }

  async remove () {
    const res = await this.API.remove(this.id)
    if (!res.ok) throw new Error(res.err)
    return this.refresh().then(() => this.data)
  }

  // async clear () {
  //   const res = await this.API. (this.cid, members)
  //   if (!res.ok) throw new Error(res.err)
  //   this.refresh().then(e => e.members)
  // }

}
