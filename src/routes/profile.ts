import { assert_hash } from '../lib/assert.js'
import { ResponseAPI } from '../schema/types.js'

import {
  ProfileData,
  ProfileRecord,
  ProfileSchema,
  ProfileTemplate
} from '../schema/model/profile.js'
import { handleResponse } from './util.js'

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

  list = async () : Promise<ResponseAPI<ProfileData[]>> => {
    return this.fetch(this.host + '/api/profile')
      .then(async res => handleResponse(res))
  }

  // create = async (
  //   contractId : string,
  //   template   : ProfileTemplate
  // ) : Promise<ResponseAPI> => {
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

  read = async (
    contractId : string
  ) : Promise<ResponseAPI<ProfileData>> => {
    assert_hash(contractId)
    return this.fetch(this.host + `/api/profile/${contractId}/read`)
      .then(async res => handleResponse(res))
  }

  update = async (
    contractId : string,
    template   : ProfileTemplate
  ) : Promise<ResponseAPI> => {
    assert_hash(contractId)
    const schema = ProfileSchema.template
    const body   = schema.parse(template)
    return this.fetch(
      this.host + `/api/profile/${contractId}/update`,
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
      this.host + `/api/profile/${contractId}/delete`
    ).then(async res => handleResponse(res))
  }

  clear = async () : Promise<ResponseAPI> => {
    return this.fetch(this.host + '/api/profile/clear')
      .then(async res => handleResponse(res))
  }

  records = {
    update: async (
      contractId : string,
      records    : ProfileRecord[]
    ) : Promise<ResponseAPI> => {
      assert_hash(contractId)
      const schema = ProfileSchema.record
      const body   = records.map(e => schema.parse(e))
      return this.fetch(
        this.host + `/api/profile/${contractId}/records/update`,
        {
          method : 'POST',
          body   : JSON.stringify(body)
        }
      ).then(async res => handleResponse(res))
    },
    remove: async (
      contractId : string,
      labels     : string[]
    ) : Promise<ResponseAPI> => {
      assert_hash(contractId)
      const schema = ProfileSchema.label
      const body   = labels.map(e => schema.parse(e))
      return this.fetch(
        this.host + `/api/profile/${contractId}/records/remove`,
        {
          method : 'POST',
          body   : JSON.stringify(body)
        }
      ).then(async res => handleResponse(res))
    }
  }
}
