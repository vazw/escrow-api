import { EscrowRouter }   from '../routes/index.js'
import { createFetch }    from '../lib/fetch.js'

import {
  apply_defaults,
  ContractCreate,
  ContractData,
  EscrowConfig,
  EscrowOptions,
  SignerAPI
} from '../schema/index.js'


export class EscrowClient {
  readonly signer  : SignerAPI
  readonly options : EscrowOptions
  readonly API     : EscrowRouter
  readonly fetch   : typeof fetch

  constructor (
    signer  : SignerAPI,
    config ?: EscrowConfig
  ) {
    const opt = apply_defaults(config)
    const { host, fetcher } = opt

    this.options = opt
    this.signer  = signer 

    this.fetch = (fetcher !== undefined)
      ? fetcher(signer)
      : createFetch(signer, config)

    this.signer = signer

    this.API = new EscrowRouter(host, this.fetch)
  }

  contract = {
    create : async (template : ContractCreate) : Promise<ContractData> => {
      const API = this.API.contract
      const res = await API.create(template)
      if (!res.ok) {
        throw new Error(res.err)
      }
      return res.data
    },
    fetch : async (contractId : string) : Promise<ContractData> => {
      const API = this.API.contract
      const res = await API.read(contractId)
      if (!res.ok) {
        throw new Error(res.err)
      }
      return res.data
    }
  }
}
