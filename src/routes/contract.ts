import { assert_hash } from '../lib/assert.js'
import { SignatureData } from '../schema/index.js'

import {
  ContractCreate,
  ContractData,
  ContractSchema,
  ContractTemplate
} from '../schema/model/contract.js'
import { RecordQuery, RecordSchema, RecordTemplate } from '../schema/model/record.js'
import { ResponseAPI } from '../schema/types.js'
import { handleResponse } from './util.js'

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

  contract = {

    list: async () : Promise<ResponseAPI<ContractData[]>> => {
      return this.fetch(this.host + '/api/contract')
        .then(async res => handleResponse(res))
    },

    create: async (
      template : ContractCreate
    ) : Promise<ResponseAPI<ContractData>> => {
      const schema = ContractSchema.create
      const body   = schema.parse(template)
      return this.fetch(
        this.host + '/api/contract/create',
        {
          method : 'POST',
          body   : JSON.stringify(body)
        }
      ).then(async res => handleResponse(res))
    },

    read: async (
      contractId : string
    ) : Promise<ResponseAPI<ContractData>> => {
      assert_hash(contractId)
      return this.fetch(this.host + `/api/contract/${contractId}`)
        .then(async res => handleResponse(res))
    },

    prune: async () : Promise<ResponseAPI> => {
      return this.fetch(this.host + '/api/contract')
        .then(async res => handleResponse(res))
    },

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
    //   ) : Promise<ResponseAPI> => {
    //     return this.fetch(
    //       this.host + `/api/contract/${contractId}/claim`,
    //       {
    //         method : 'POST',
    //         body   : JSON.stringify(payload)
    //       }
    //     )
    //   }
    // }

    update: async (
      contractId : string,
      template   : ContractTemplate
    ) : Promise<ResponseAPI> => {
      assert_hash(contractId)
      const schema = ContractSchema.template
      const body   = schema.parse(template)
      return this.fetch(
        this.host + `/api/contract/${contractId}/admin/update`,
        {
          method : 'POST',
          body   : JSON.stringify(body)
        }
      ).then(async res => handleResponse(res))
    },

    cancel: async (
      contractId : string
    ) : Promise<ResponseAPI> => {
      assert_hash(contractId)
      return this.fetch(
        this.host + `/api/contract/${contractId}/admin/cancel`
      ).then(async res => handleResponse(res))
    }
  }

  endorse = {
    update: async (
      contractId  : string,
      endorsement : string
    ) : Promise<ResponseAPI> => {
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
    },
    remove: async (
      contractId : string
    ) : Promise<ResponseAPI> => {
      assert_hash(contractId)
      return this.fetch(
        this.host + `/api/contract/${contractId}/endorse/remove`,
        {
          method: 'POST'
        }
      ).then(async res => handleResponse(res))
    }
  }

  members = {
    update: async (
      contractId : string,
      members    : string[]
    ) : Promise<ResponseAPI> => {
      assert_hash(contractId)
      const schema = ContractSchema.members
      const body   = schema.parse(members)
      return this.fetch(
        this.host + `/api/contract/${contractId}/members/update`,
        {
          method : 'POST',
          body   : JSON.stringify(body)
        }
      ).then(async res => handleResponse(res))
    },
    remove: async (
      contractId : string,
      members    : string[]
    ) : Promise<ResponseAPI> => {
      assert_hash(contractId)
      const schema = ContractSchema.members
      const body   = schema.parse(members)
      return this.fetch(
        this.host + `/api/contract/${contractId}/members/remove`,
        {
          method : 'POST',
          body   : JSON.stringify(body)
        }
      ).then(async res => handleResponse(res))
    }
  }

  records = {
    update: async (
      contractId : string,
      records    : RecordTemplate[]
    ) : Promise<ResponseAPI> => {
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
    },
    remove: async (
      contractId : string,
      queries    : RecordQuery[]
    ) : Promise<ResponseAPI> => {
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

  sign = {
    list: async (
      contractId : string
    ) : Promise<ResponseAPI<SignatureData[]>> => {
      assert_hash(contractId)
      return this.fetch(
        this.host + `/api/contract/${contractId}/signature`
      ).then(async res => handleResponse(res))
    },
    update: async (
      contractId : string,
      signature  : string
    ) : Promise<ResponseAPI> => {
      assert_hash(contractId)
      const schema = ContractSchema.signature
      const body   = schema.parse(signature)
      return this.fetch(
        this.host + `/api/contract/${contractId}/signature/update`,
        {
          method : 'POST',
          body   : JSON.stringify(body)
        }
      ).then(async res => handleResponse(res))
    },
    remove: async (
      contractId : string
    ) : Promise<ResponseAPI> => {
      assert_hash(contractId)
      return this.fetch(
        this.host + `/api/contract/${contractId}/signature/remove`,
        {
          method: 'POST'
        }
      ).then(async res => handleResponse(res))
    }
  }
}
