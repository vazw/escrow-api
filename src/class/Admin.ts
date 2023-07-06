import { EscrowContract }   from './Contract.js'
import { EscrowRouter }     from '../routes/index.js'

import { ContractTemplate } from '../schema/index.js'

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

  get API () : EscrowRouter {
    return this._contract._client.API
  }

  async refresh () {
    return this._contract.fetch()
  }

  async update (template : ContractTemplate) {
    const res = await this.API.admin.update(this.id, template)
    if (!res.ok) throw new Error(res.err)
    return this.refresh().then(e => e.access)
  }

  async cancel () {
    const res = await this.API.admin.cancel(this.id)
    if (!res.ok) throw new Error(res.err)
    return this.refresh().then(e => e.access)
  }

  access = {
    add : async (members : string[]) => {
      const res = await this.API.access.update(this.id, members)
      if (!res.ok) throw new Error(res.err)
      return this.refresh().then(e => e.access)
    },
    remove : async (members : string[]) => {
      const res = await this.API.access.remove(this.id, members)
      if (!res.ok) throw new Error(res.err)
      return this.refresh().then(e => e.access)
    }
  }
}
