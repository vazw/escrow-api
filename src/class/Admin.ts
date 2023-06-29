import { EscrowContract } from './Contract.js'
import { MembersRouter }  from '../routes/access.js'

export class AdminController {
  readonly _contract : EscrowContract

  constructor (
    contract : EscrowContract,
  ) {
    this._contract = contract
  }

  get id () : string {
    return this._contract.id
  }

  get API () : MembersRouter {
    return this._contract._client.API.members
  }

  async refresh () {
    return this._contract.fetch()
  }

  async add (member : string) {
    const res = await this.API.update(this.id, [ member ])
    if (!res.ok) throw new Error(res.err)
    return this.refresh().then(e => e.members)
  }

  async remove (member : string) {
    const res = await this.API.remove(this.id, [ member ])
    if (!res.ok) throw new Error(res.err)
    return this.refresh().then(e => e.members)
  }

  async update (members : string[]) {
    const res = await this.API.update(this.id, members)
    if (!res.ok) throw new Error(res.err)
    return this.refresh().then(e => e.members)
  }

  async delete (members : string[]) {
    const res = await this.API.remove(this.id, members)
    if (!res.ok) throw new Error(res.err)
    return this.refresh().then(e => e.members)
  }

  // async clear () {
  //   const res = await this.API. (this.cid, members)
  //   if (!res.ok) throw new Error(res.err)
  //   this.refresh().then(e => e.members)
  // }

}
