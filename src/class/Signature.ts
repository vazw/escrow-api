import { Buff }            from '@cmdcode/buff-utils'
import { EscrowContract }  from './Contract.js'
import { SignatureRouter } from '../routes/signatures.js'
import { SignatureData }   from '../schema/index.js'

export class SignatureController {
  readonly _contract : EscrowContract

  constructor (
    contract : EscrowContract,
  ) {
    this._contract = contract
  }

  get API () : SignatureRouter {
    return this._contract._client.API.signatures
  }

  get cid () : string {
    return this._contract.cid
  }

  get pubkey () : string {
    return this._contract._client.pubkey.hex
  }

  get data () : Promise<SignatureData | undefined> {
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

  async list () : Promise<SignatureData[]> {
    return this._contract.data.then(e => e.signatures)
  }

  async add (hash ?: string) {
    if (hash === undefined) {
      hash = await this.hash
    }
    const sig = this.signer(hash)
    const res = await this.API.update(this.cid, {
      hash,
      psig : Buff.bytes(sig).hex
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
