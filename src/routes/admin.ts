import { assert_hash }    from '../lib/assert.js'
import { handleResponse } from './util.js'

import {
  ContractSchema,
  ContractTemplate,
  ResponseAPI
} from '../schema/index.js'

type Fetcher = typeof fetch

export class AdminRouter {
  readonly host  : string
  readonly fetch : Fetcher

  constructor (
    hostname : string,
    fetcher  : Fetcher
  ) {
    this.host  = hostname
    this.fetch = fetcher
  }

  async update (
    contractId : string,
    template   : ContractTemplate
  ) : Promise<ResponseAPI> {
    assert_hash(contractId)
    const schema = ContractSchema.template
    const body   = schema.parse(template)
    return this.fetch(
      this.host + `/api/contract/${contractId}/admin/update`,
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
      this.host + `/api/contract/${contractId}/admin/cancel`
    ).then(async res => handleResponse(res))
  }
}
