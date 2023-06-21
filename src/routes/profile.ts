import { assert_hash } from '../lib/assert.js'

import {
  ProfileRecord,
  ProfileSchema,
  ProfileTemplate
} from '../schema/model/profile.js'

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

  list = async () : Promise<Response> => {
    return this.fetch(this.host + '/api/profile')
  }

  // create = async (
  //   contractId : string,
  //   template   : ProfileTemplate
  // ) : Promise<Response> => {
  //   assert_hash(contractId)
  //   const schema = ProfileSchema.template
  //   const body   = schema.parse(template)
  //   return this.fetch(
  //     this.host + `/api/profile/${contractId}/create`,
  //     {
  //       method : 'POST',
  //       body   : JSON.stringify(body)
  //     }
  //   )
  // }

  read = async (contractId : string) : Promise<Response> => {
    assert_hash(contractId)
    return this.fetch(this.host + `/api/profile/${contractId}/read`)
  }

  update = async (
    contractId : string,
    template   : ProfileTemplate
  ) : Promise<Response> => {
    assert_hash(contractId)
    const schema = ProfileSchema.template
    const body   = schema.parse(template)
    return this.fetch(
      this.host + `/api/profile/${contractId}/update`,
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
      this.host + `/api/profile/${contractId}/delete`
    )
  }

  clear = async () : Promise<Response> => {
    return this.fetch(this.host + '/api/profile/clear')
  }

  records = {
    update: async (
      contractId : string,
      records    : ProfileRecord[]
    ) : Promise<Response> => {
      assert_hash(contractId)
      const schema = ProfileSchema.record
      const body   = records.map(e => schema.parse(e))
      return this.fetch(
        this.host + `/api/profile/${contractId}/records/update`,
        {
          method : 'POST',
          body   : JSON.stringify(body)
        }
      )
    },
    remove: async (
      contractId : string,
      labels     : string[]
    ) : Promise<Response> => {
      assert_hash(contractId)
      const schema = ProfileSchema.label
      const body   = labels.map(e => schema.parse(e))
      return this.fetch(
        this.host + `/api/profile/${contractId}/records/remove`,
        {
          method : 'POST',
          body   : JSON.stringify(body)
        }
      )
    }
  }
}
