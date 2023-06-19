import { assert_hash } from '../lib/assert.js'

import {
  DisputeSchema,
  DisputeTemplate
} from '../schema/model/dispute.js'

type Fetcher = typeof fetch

export class DisputeRouter {
  readonly host  : string
  readonly fetch : Fetcher

  constructor (
    hostname : string,
    fetcher  : Fetcher
  ) {
    this.host  = hostname
    this.fetch = fetcher
  }

  list = async () : Promise<Response> => {
    return this.fetch(this.host + '/api/dispute')
  }

  create = async (
    contractId : string,
    template   : DisputeTemplate
  ) : Promise<Response> => {
    assert_hash(contractId)
    const schema = DisputeSchema.template
    const body   = schema.parse(template)
    return this.fetch(
      this.host + `/api/dispute/${contractId}/create`,
      {
        method : 'POST',
        body   : JSON.stringify(body)
      }
    )
  }

  read = async (contractId : string) : Promise<Response> => {
    assert_hash(contractId)
    return this.fetch(this.host + `/api/dispute/${contractId}`)
  }

  update = async (
    contractId : string,
    template   : DisputeTemplate
  ) : Promise<Response> => {
    assert_hash(contractId)
    const schema = DisputeSchema.template
    const body   = schema.parse(template)
    return this.fetch(
      this.host + `/api/dispute/${contractId}/update`,
      {
        method : 'POST',
        body   : JSON.stringify(body)
      }
    )
  }

  remove = async (
    contractId : string
  ) : Promise<Response> => {
    assert_hash(contractId)
    return this.fetch(
      this.host + `/api/dispute/${contractId}/delete`
    )
  }

  clear = async () : Promise<Response> => {
    return this.fetch(this.host + '/api/dispute/clear')
  }

  records = {
    update: async (
      contractId : string,
      records    : string[]
    ) : Promise<Response> => {
      assert_hash(contractId)
      return this.fetch(
        this.host + `/api/profile/${contractId}/record/add`,
        {
          method : 'POST',
          body   : JSON.stringify(records)
        }
      )
    },
    remove: async (
      contractId : string,
      records    : string[]
    ) : Promise<Response> => {
      assert_hash(contractId)
      return this.fetch(
        this.host + `/api/profile/${contractId}/record/remove`,
        {
          method : 'POST',
          body   : JSON.stringify(records)
        }
      )
    }
  }
}
