import { assert_hash } from '../lib/assert.js'

import {
  ContractCreate,
  ContractSchema,
  ContractTemplate
} from '../schema/model/contract.js'
import { RecordQuery, RecordSchema, RecordTemplate } from '../schema/model/record.js'

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

  create = async (template : ContractCreate) : Promise<Response> => {
    const schema = ContractSchema.create
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

  // actions = {
  //   deposit: async (
  //     contractId : string,
  //     template   : string
  //   ) => {
  //     return this.fetch(
  //       this.host + `/api/contract/${contractId}/deposit`,
  //       {
  //         method : 'POST',
  //         body   : JSON.stringify(payload)
  //       }
  //     )
  //   },
  //   claim: async (
  //     contractId : string,
  //     payload    : string
  //   ) : Promise<Response> => {
  //     return this.fetch(
  //       this.host + `/api/contract/${contractId}/claim`,
  //       {
  //         method : 'POST',
  //         body   : JSON.stringify(payload)
  //       }
  //     )
  //   }
  // }

  update = async (
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
  }

  cancel = async (
    contractId : string
  ) : Promise<Response> => {
    assert_hash(contractId)
    return this.fetch(
      this.host + `/api/contract/${contractId}/admin/cancel`
    )
  }

  endorse = {
    update: async (
      contractId  : string,
      endorsement : string
    ) : Promise<Response> => {
      assert_hash(contractId)
      const schema = ContractSchema.endorsement
      const body   = schema.parse(endorsement)
      return this.fetch(
        this.host + `/api/contract/${contractId}/endorse/update`,
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
        this.host + `/api/contract/${contractId}/endorse/remove`,
        {
          method: 'POST'
        }
      )
    }
  }

  members = {
    update: async (
      contractId : string,
      members    : string[]
    ) : Promise<Response> => {
      assert_hash(contractId)
      const schema = ContractSchema.members
      const body   = schema.parse(members)
      return this.fetch(
        this.host + `/api/contract/${contractId}/members/update`,
        {
          method : 'POST',
          body   : JSON.stringify(body)
        }
      )
    },
    remove: async (
      contractId : string,
      members    : string[]
    ) : Promise<Response> => {
      assert_hash(contractId)
      const schema = ContractSchema.members
      const body   = schema.parse(members)
      return this.fetch(
        this.host + `/api/contract/${contractId}/members/remove`,
        {
          method : 'POST',
          body   : JSON.stringify(body)
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
        this.host + `/api/contract/${contractId}/record/update`,
        {
          method : 'POST',
          body   : JSON.stringify(body)
        }
      )
    },
    remove: async (
      contractId : string,
      queries    : RecordQuery[]
    ) : Promise<Response> => {
      assert_hash(contractId)
      const schema = RecordSchema.query
      const body   = queries.map(e => schema.parse(e))
      return this.fetch(
        this.host + `/api/contract/${contractId}/record/remove`,
        {
          method : 'POST',
          body   : JSON.stringify(body)
        }
      )
    }
  }

  sign = {
    update: async (
      contractId : string,
      signature  : string
    ) : Promise<Response> => {
      assert_hash(contractId)
      const schema = ContractSchema.signature
      const body   = schema.parse(signature)
      return this.fetch(
        this.host + `/api/contract/${contractId}/sign/update`,
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
        this.host + `/api/contract/${contractId}/sign/remove`,
        {
          method: 'POST'
        }
      )
    }
  }
}
