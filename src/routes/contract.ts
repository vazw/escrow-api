import { assert_hash }    from '../lib/assert.js'
import { handleResponse } from './util.js'

import {
  ContractCreate,
  ContractData,
  // ContractTemplate,
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

  // async update (
  //   contractId : string,
  //   template   : ContractTemplate
  // ) : Promise<ResponseAPI> {
  //   assert_hash(contractId)
  //   const schema = DetailSchema.template
  //   const body   = schema.parse(template)
  //   return this.fetch(
  //     this.host + `/api/contract/${contractId}/admin/update`,
  //     {
  //       method : 'POST',
  //       body   : JSON.stringify(body)
  //     }
  //   ).then(async res => handleResponse(res))
  // }

  async cancel (
    contractId : string
  ) : Promise<ResponseAPI> {
    assert_hash(contractId)
    return this.fetch(
      this.host + `/api/contract/${contractId}/admin/cancel`
    ).then(async res => handleResponse(res))
  }
}
