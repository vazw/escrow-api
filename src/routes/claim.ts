import { assert_hash }    from '../lib/assert.js'
import { handleResponse } from './util.js'

import {
  ClaimSchema,
  ClaimTemplate,
  ResponseAPI
} from '../schema/index.js'

type Fetcher = typeof fetch

export class ClaimRouter {
  readonly host  : string
  readonly fetch : Fetcher

  constructor (
    hostname : string,
    fetcher  : Fetcher
  ) {
    this.host  = hostname
    this.fetch = fetcher
  }

  async status (
    contractId : string
  ) : Promise<ResponseAPI> {
    return this.fetch(
      this.host + `/api/contract/${contractId}/claim/status`,
      { method: 'GET' }
    ).then(async res => handleResponse(res))
  }

  async update (
    contractId : string,
    claim      : ClaimTemplate
  ) : Promise<ResponseAPI> {
    assert_hash(contractId)
    const schema = ClaimSchema.template
    const body   = schema.parse(claim)
    return this.fetch(
      this.host + `/api/contract/${contractId}/claim/update`,
      {
        method : 'POST',
        body   : JSON.stringify(body)
      }
    ).then(async res => handleResponse(res))
  }

  async cancel (
    contractId : string
  ) : Promise<ResponseAPI> {
    assert_hash(contractId)
    return this.fetch(
      this.host + `/api/contract/${contractId}/claim/cancel`,
      { method: 'GET' }
    ).then(async res => handleResponse(res))
  }
}
