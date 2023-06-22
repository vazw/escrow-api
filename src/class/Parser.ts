import { EscrowContract } from './Contract.js'
import { ContractData }   from '../schema/index.js'

export class ContractParser {
  readonly _contract : EscrowContract

  constructor (contract : EscrowContract) {
    this._contract = contract
  }

  async parse (data : ContractData) : Promise<ContractData> {
    return data
  }

}
