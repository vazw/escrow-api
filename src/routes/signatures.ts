import { assert_hash }    from '../lib/assert.js'
import { handleResponse } from './util.js'

import {
  SignatureSchema,
  SignatureTemplate,
  ResponseAPI
} from '../schema/index.js'

type Fetcher = typeof fetch

export class SignatureRouter {
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
    signature  : SignatureTemplate
  ) : Promise<ResponseAPI> {
    assert_hash(contractId)
    const schema = SignatureSchema.template
    const body   = schema.parse(signature)
    return this.fetch(
      this.host + `/api/contract/${contractId}/signature/update`,
      {
        method : 'POST',
        body   : JSON.stringify(body)
      }
    ).then(async res => handleResponse(res))
  }

  async remove (
    contractId : string
  ) : Promise<ResponseAPI> {
    assert_hash(contractId)
    return this.fetch(
      this.host + `/api/contract/${contractId}/signature/remove`,
      { method: 'GET' }
    ).then(async res => handleResponse(res))
  }
}
