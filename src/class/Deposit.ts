import { EscrowContract } from './Contract.js'
import { DepositRouter }    from '../routes/deposit.js'
// import { DepositData }      from '../schema/index.js'

export class DepositController {
  readonly _contract : EscrowContract

  constructor (
    contract : EscrowContract,
  ) {
    this._contract = contract
  }

  get API () : DepositRouter {
    return this._contract.API.deposit
  }

  get contract_id () : string {
    return this._contract.id
  }

  // get data () : Promise<DepositData | undefined> {
  //   return this._contract.deposits.then(e => {
  //     return e.find(p => p.pubkey === this.signer.pubkey)
  //   })
  // }

  get signer () {
    return this._contract.signer
  }

  async refresh () {
    return this._contract.fetch()
  }

  // async update (hash : string) {
  //   const id  = this.contract_id
  //   const sig = this.signer.sign(hash)
  //   const res = await this.API.update(id, {
  //     kind : 'close',
  //     hash,
  //     psig : Buff.bytes(sig).hex
  //   })
  //   if (res.ok) this.refresh()
  //   return res
  // }

  // async remove () {
  //   const res = await this.API.(this.contract_id)
  //   if (res.ok) this.refresh()
  //   return res
  // }

  // async clear () {
  //   const id  = this.contract_id
  //   const res = await this.API.clear(id)
  //   if (res.ok) this.refresh()
  //   return res
  // }

}
