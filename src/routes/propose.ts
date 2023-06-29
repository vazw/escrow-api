import { assert_hash } from '../lib/assert.js'
import { handleResponse } from './util.js'

import {
  ProposalSchema,
  ProposalTemplate,
  ResponseAPI
} from '../schema/index.js'

type Fetcher = typeof fetch

export class ProfileRouter {
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

  // tags = {
  //   update: async (
  //     contractId : string,
  //     tags       : ProfileTag[]
  //   ) : Promise<ResponseAPI> => {
  //     assert_hash(contractId)
  //     const schema = ProfileSchema.tags
  //     const body   = tags.map(e => schema.parse(e))
  //     return this.fetch(
  //       this.host + `/api/contract/${contractId}/profile/tags/update`,
  //       {
  //         method : 'POST',
  //         body   : JSON.stringify(body)
  //       }
  //     ).then(async res => handleResponse(res))
  //   },
  //   remove: async (
  //     contractId : string,
  //     labels     : string[]
  //   ) : Promise<ResponseAPI> => {
  //     assert_hash(contractId)
  //     const schema = BaseSchema.str
  //     const body   = labels.map(e => schema.parse(e))
  //     return this.fetch(
  //       this.host + `/api/contract/${contractId}/profile/tags/remove`,
  //       {
  //         method : 'POST',
  //         body   : JSON.stringify(body)
  //       }
  //     ).then(async res => handleResponse(res))
  //   }
  // }
}
