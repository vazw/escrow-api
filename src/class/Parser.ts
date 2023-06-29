import { EscrowContract } from './Contract.js'
import { ContractData }   from '../schema/index.js'

export class ContractParser {
  readonly _contract : EscrowContract

  constructor (contract : EscrowContract) {
    this._contract = contract
  }

  async parse (data : ContractData) : Promise<ContractData> {
    // We need to build a transaction based on the deposits
    // and finalized terms.

    // Validation should be as simple as checking that the
    // calculated tx matches the other signatures.
    return data
  }

}
