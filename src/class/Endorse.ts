import { Buff }           from '@cmdcode/buff-utils'
import { EscrowContract } from './Contract.js'
import { EndorseRouter }  from '../routes/endorse.js'
import { EndorseData }    from '../schema/index.js'

export class EndorseController {
  readonly _contract : EscrowContract

  constructor (
    contract : EscrowContract,
  ) {
    this._contract = contract
  }

  get API () : EndorseRouter {
    return this._contract._client.API.endorse
  }

  get cid () : string {
    return this._contract.cid
  }

  get pubkey () : string {
    return this._contract._client.pubkey.hex
  }

  get data () : Promise<EndorseData | undefined> {
    return this.list().then(e => e.find(p => p.pubkey === this.pubkey))
  }

  get hash () : Promise<string> {
    return this._contract.data.then(e => e.meta.block_id)
  }

  get signer () {
    return this._contract._client.sign
  }

  async refresh () {
    return this._contract.fetch()
  }

  async list () : Promise<EndorseData[]> {
    return this._contract.data.then(e => e.endorsements)
  }

  async add (hash ?: string) {
    if (hash === undefined) {
      hash = await this.hash
    }
    const sig = this.signer(hash)
    const res = await this.API.update(this.cid, {
      hash,
      signature : Buff.bytes(sig).hex
    })
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
