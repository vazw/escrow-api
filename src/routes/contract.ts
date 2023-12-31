import { assert_hash }    from '../lib/assert.js'
import { handleResponse } from './util.js'

import {
  ContractCreate,
  ContractData,
  ContractSchema,
  ResponseAPI
} from '../schema/index.js'

type Fetcher = typeof fetch

export class ContractRouter {
  readonly host  : string
  readonly fetch : Fetcher

  constructor (
    hostname : string,
    fetcher  : Fetcher
  ) {
    this.host  = hostname
    this.fetch = fetcher
  }

  async list () : Promise<ResponseAPI<ContractData[]>> {
    return this.fetch(this.host + '/api/contract')
      .then(async res => handleResponse(res))
  }

  async read (
    contractId : string
  ) : Promise<ResponseAPI<ContractData>> {
    assert_hash(contractId)
    return this.fetch(this.host + `/api/contract/${contractId}`)
      .then(async res => handleResponse(res))
  }

  async create (
    template : ContractCreate
  ) : Promise<ResponseAPI<ContractData>> {
    const schema = ContractSchema.create
    const body   = schema.parse(template)
    return this.fetch(
      this.host + '/api/contract/create',
      {
        method : 'POST',
        body   : JSON.stringify(body)
      }
    ).then(async res => handleResponse(res))
  }

  async status (
    contractId : string
  ) : Promise<ResponseAPI> {
    return this.fetch(
      this.host + `/api/contract/${contractId}/status`,
      { method: 'GET' }
    ).then(async res => handleResponse(res))
  }
}
