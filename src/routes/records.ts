import { assert_hash }    from '../lib/assert.js'
import { ResponseAPI }    from '../schema/types.js'
import { handleResponse } from './util.js'

import {
  RecordQuery,
  RecordSchema,
  RecordTemplate
} from '../schema/index.js'

type Fetcher = typeof fetch

export class RecordRouter {
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
    records    : RecordTemplate[]
  ) : Promise<ResponseAPI> {
    assert_hash(contractId)
    const schema = RecordSchema.template
    const body   = records.map(e => schema.parse(e))
    return this.fetch(
      this.host + `/api/contract/${contractId}/record/update`,
      {
        method : 'POST',
        body   : JSON.stringify(body)
      }
    ).then(async res => handleResponse(res))
  }

  async remove (
    contractId : string,
    queries    : RecordQuery[]
  ) : Promise<ResponseAPI> {
    assert_hash(contractId)
    const schema = RecordSchema.query
    const body   = queries.map(e => schema.parse(e))
    return this.fetch(
      this.host + `/api/contract/${contractId}/record/remove`,
      {
        method : 'POST',
        body   : JSON.stringify(body)
      }
    ).then(async res => handleResponse(res))
  }
}
