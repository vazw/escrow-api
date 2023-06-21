import { assert_hash }    from '../lib/assert.js'
import { ContractSchema } from '../schema/model/contract.js'
import { ResponseAPI }    from '../schema/types.js'
import { handleResponse } from './util.js'
import { SignatureData, SignatureTemplate }  from '../schema/index.js'

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

  async list (
    contractId : string
  ) : Promise<ResponseAPI<SignatureData[]>> {
    assert_hash(contractId)
    return this.fetch(
      this.host + `/api/contract/${contractId}/signature`
    ).then(async res => handleResponse(res))
  }

  async update (
    contractId : string,
    signature  : SignatureTemplate
  ) : Promise<ResponseAPI> {
    assert_hash(contractId)
    const schema = ContractSchema.signature
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
      {
        method: 'POST'
      }
    ).then(async res => handleResponse(res))
  }
}
