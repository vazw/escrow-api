import { assert_hash } from '../lib/assert.js'

import {
  ContractSchema,
  ContractTemplate
} from '../schema/model/contract.js'
import { RecordSchema, RecordTemplate } from '../schema/model/record.js'

type Fetcher = typeof fetch

export class ContractRouter {
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
    return this.fetch(this.host + '/api/contract')
  }

  create = async (template : ContractTemplate) : Promise<Response> => {
    const schema = ContractSchema.template
    const body   = schema.parse(template)
    return this.fetch(
      this.host + '/api/contract/create',
      {
        method : 'POST',
        body   : JSON.stringify(body)
      }
    )
  }

  read = async (contractId : string) : Promise<Response> => {
    assert_hash(contractId)
    return this.fetch(this.host + `/api/contract/${contractId}`)
  }

  prune = async () : Promise<Response> => {
    return this.fetch(this.host + '/api/contract')
  }

  actions = {
    deposit: async (
      contractId : string,
      template   : string
    ) => {
      return this.fetch(
        this.host + `/api/contract/${contractId}/deposit`,
        {
          method : 'POST',
          body   : JSON.stringify(payload)
        }
      )
    },
    claim: async (
      contractId : string,
      payload    : string
    ) : Promise<Response> => {
      return this.fetch(
        this.host + `/api/contract/${contractId}/claim`,
        {
          method : 'POST',
          body   : JSON.stringify(payload)
        }
      )
    }
  }

  admin = {
    update: async (
      contractId : string,
      template   : ContractTemplate
    ) : Promise<Response> => {
      assert_hash(contractId)
      const schema = ContractSchema.template
      const body   = schema.parse(template)
      return this.fetch(
        this.host + `/api/contract/${contractId}/admin/update`,
        {
          method : 'POST',
          body   : JSON.stringify(body)
        }
      )
    },
    cancel: async (
      contractId : string
    ) : Promise<Response> => {
      assert_hash(contractId)
      return this.fetch(
        this.host + `/api/contract/${contractId}/admin/delete`
      )
    }
  }

  members = {
    update: async (
      contractId : string,
      members    : string[]
    ) : Promise<Response> => {
      assert_hash(contractId)
      return this.fetch(
        this.host + `/api/contract/${contractId}/members/add`,
        {
          method : 'POST',
          body   : JSON.stringify(members)
        }
      )
    },
    remove: async (
      contractId : string,
      members    : string[]
    ) : Promise<Response> => {
      assert_hash(contractId)
      return this.fetch(
        this.host + `/api/contract/${contractId}/members/remove`,
        {
          method : 'POST',
          body   : JSON.stringify(members)
        }
      )
    }
  }

  records = {
    update: async (
      contractId : string,
      records    : RecordTemplate[]
    ) : Promise<Response> => {
      assert_hash(contractId)
      const schema = RecordSchema.template
      const body   = records.map(e => schema.parse(e))
      return this.fetch(
        this.host + `/api/contract/${contractId}/records/update`,
        {
          method : 'POST',
          body   : JSON.stringify(body)
        }
      )
    },
    remove: async (
      contractId : string,
      records    : string[]
    ) : Promise<Response> => {
      assert_hash(contractId)
      const schema = RecordSchema.query
      const body   = records.map(e => schema.parse(e))
      return this.fetch(
        this.host + `/api/contract/${contractId}/records/remove`,
        {
          method : 'POST',
          body   : JSON.stringify(body)
        }
      )
    }
  }

  signatures = {
    update: async (
      contractId : string,
      template   : SignTemplate
    ) : Promise<Response> => {
      assert_hash(contractId)
      const schema = SignSchema.template
      const body   = schema.parse()
      return this.fetch(
        this.host + `/api/contract/${contractId}/signatures/update`,
        {
          method : 'POST',
          body   : JSON.stringify(body)
        }
      )
    },
    remove: async (
      contractId : string
    ) : Promise<Response> => {
      assert_hash(contractId)
      return this.fetch(
        this.host + `/api/contract/${contractId}/signatures/remove`,
        {
          method: 'POST'
        }
      )
    }
  }
}
