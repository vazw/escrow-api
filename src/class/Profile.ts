import { EscrowContract } from './Contract.js'
import { ProfileRouter }  from '../routes/profile.js'
import { ProfileData, ProfileTemplate } from '../schema/index.js'

export class ProfileController {
  readonly _contract : EscrowContract

  constructor (
    contract : EscrowContract,
  ) {
    this._contract = contract
  }

  get API () : ProfileRouter {
    return this._contract._client.API.profile
  }

  get cid () : string {
    return this._contract.cid
  }

  get pubkey () : string {
    return this._contract._client.pubkey.hex
  }

  get data () : Promise<ProfileData | undefined> {
    return this.list().then(e => e.find(p => p.pubkey === this.pubkey))
  }

  async refresh () {
    return this._contract.fetch()
  }

  async list () : Promise<ProfileData[]> {
    return this._contract.data.then(e => e.profiles)
  }

  async create (template : ProfileTemplate) {
    const res = await this.API.update(this.cid, template)
    if (!res.ok) throw new Error(res.err)
    return this.refresh().then(() => this.data)
  }

  async set (template : ProfileTemplate) {
    const res = await this.API.update(this.cid, template)
    if (!res.ok) throw new Error(res.err)
    return this.refresh().then(() => this.data)
  }

  async update (template : ProfileTemplate) {
    const res = await this.API.update(this.cid, template)
    if (!res.ok) throw new Error(res.err)
    return this.refresh().then(() => this.data)
  }

  async remove () {
    const res = await this.API.remove(this.cid)
    if (!res.ok) throw new Error(res.err)
    return this.refresh().then(() => this.data)
  }

  // async clear () {
  //   const res = await this.API. (this.cid, members)
  //   if (!res.ok) throw new Error(res.err)
  //   this.refresh().then(e => e.members)
  // }

}
