import { assert_hash }    from '../lib/assert.js'
import { handleResponse } from './util.js'

import {
  BaseSchema,
  DepositSchema,
  DepositTemplate,
  ResponseAPI
} from '../schema/index.js'

type Fetcher = typeof fetch

export class DepositRouter {
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
      this.host + `/api/contract/${contractId}/deposit/status`,
      { method: 'GET' }
    ).then(async res => handleResponse(res))
  }

  async request (
    contractId : string,
    template   : DepositTemplate
  ) : Promise<ResponseAPI> {
    assert_hash(contractId)
    const schema = DepositSchema.template
    const body   = schema.parse(template)
    return this.fetch(
      this.host + `/api/contract/${contractId}/deposit/request`,
      {
        method : 'POST',
        body   : JSON.stringify(body)
      }
    ).then(async res => handleResponse(res))
  }

  async submit (
    contractId : string,
    psbtData   : string
  ) : Promise<ResponseAPI> {
    assert_hash(contractId)
    const schema = BaseSchema.hex
    const body   = schema.parse(psbtData)
    return this.fetch(
      this.host + `/api/contract/${contractId}/deposit/submit`,
      {
        method : 'POST',
        body   : JSON.stringify(body)
      }
    ).then(async res => handleResponse(res))
  }
}
