import { assert_hash } from '../lib/assert.js'

import {
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

  create = async (
    contractId : string,
    template   : ProfileTemplate
  ) : Promise<Response> => {
    assert_hash(contractId)
    const schema = ProfileSchema.template
    const body   = schema.parse(template)
    return this.fetch(
      this.host + `/api/profile/${contractId}/create`,
      {
        method : 'POST',
        body   : JSON.stringify(body)
      }
    )
  }

  read = async (contractId : string) : Promise<Response> => {
    assert_hash(contractId)
    return this.fetch(this.host + `/api/profile/${contractId}`)
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

  tags = {
    update: async (
      contractId : string,
      tags       : string[]
    ) : Promise<Response> => {
      assert_hash(contractId)
      const schema = ProfileSchema.tags
      const body   = schema.parse(tags)
      return this.fetch(
        this.host + `/api/profile/${contractId}/tags/update`,
        {
          method : 'POST',
          body   : JSON.stringify(body)
        }
      )
    },
    remove: async (
      contractId : string,
      tags       : string[]
    ) : Promise<Response> => {
      assert_hash(contractId)
      const schema = ProfileSchema.tags
      const body   = schema.parse(tags)
      return this.fetch(
        this.host + `/api/profile/${contractId}/tags/remove`,
        {
          method : 'POST',
          body   : JSON.stringify(body)
        }
      )
    }
  }
}
