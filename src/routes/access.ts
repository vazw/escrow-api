import { assert_hash }    from '../lib/assert.js'
import { ContractSchema } from '../schema/model/contract.js'
import { ResponseAPI }    from '../schema/types.js'
import { handleResponse } from './util.js'

type Fetcher = typeof fetch

export class AccessRouter {
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
    members    : string[]
  ) : Promise<ResponseAPI> {
    assert_hash(contractId)
    const schema = ContractSchema.access
    const body   = schema.parse(members)
    return this.fetch(
      this.host + `/api/contract/${contractId}/access/update`,
            {
        method : 'POST',
        body   : JSON.stringify(body)
      }
    ).then(async res => handleResponse(res))
  }

  async remove (
    contractId : string,
    members    : string[]
  ) : Promise<ResponseAPI> {
    assert_hash(contractId)
    const schema = ContractSchema.access
    const body   = schema.parse(members)
    return this.fetch(
      this.host + `/api/contract/${contractId}/access/remove`,
            {
        method : 'POST',
        body   : JSON.stringify(body)
      }
    ).then(async res => handleResponse(res))
  }
}
