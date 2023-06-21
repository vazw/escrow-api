import { assert_hash }     from '../lib/assert.js'
import { EndorseTemplate } from '../schema/index.js'
import { ContractSchema }  from '../schema/model/contract.js'
import { ResponseAPI }     from '../schema/types.js'
import { handleResponse }  from './util.js'

type Fetcher = typeof fetch

export class EndorseRouter {
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
    contractId  : string,
    endorsement : EndorseTemplate
  ) : Promise<ResponseAPI> {
    assert_hash(contractId)
    const schema = ContractSchema.endorsement
    const body   = schema.parse(endorsement)
    return this.fetch(
      this.host + `/api/contract/${contractId}/endorse/update`,
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
      this.host + `/api/contract/${contractId}/endorse/remove`,
      {
        method: 'POST'
      }
    ).then(async res => handleResponse(res))
  }
}
