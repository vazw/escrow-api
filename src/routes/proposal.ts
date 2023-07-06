import { assert_hash } from '../lib/assert.js'
import { handleResponse } from './util.js'

import {
  ProposalSchema,
  ProposalTemplate,
  ResponseAPI
} from '../schema/index.js'

type Fetcher = typeof fetch

export class ProposalRouter {
  readonly host  : string
  readonly fetch : Fetcher

  constructor (
    hostname : string,
    fetcher  : Fetcher
  ) {
    this.host  = hostname
    this.fetch = fetcher
  }

  update = async (
    contractId : string,
    template   : ProposalTemplate
  ) : Promise<ResponseAPI> => {
    assert_hash(contractId)
    const schema = ProposalSchema.template
    const body   = schema.parse(template)
    return this.fetch(
      this.host + `/api/contract/${contractId}/proposal/update`,
      {
        method : 'POST',
        body   : JSON.stringify(body)
      }
    ).then(async res => handleResponse(res))
  }

  remove = async (
    contractId : string
  ) : Promise<ResponseAPI> => {
    assert_hash(contractId)
    return this.fetch(
      this.host + `/api/contract/${contractId}/proposal/remove`
    ).then(async res => handleResponse(res))
  }
}
