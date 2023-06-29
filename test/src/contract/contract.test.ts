import { Test } from 'tape'
import { Buff } from '@cmdcode/buff-utils'
import { ContractSchema, EscrowClient } from '../../../src/index.js'

import vectors from '../vectors.json' assert { type: 'json' }
import { assert_hash } from '../../../src/lib/assert.js'

type Vector = typeof vectors[0]

export async function contract_test (t : Test) {
  const host   = 'http://localhost:3000'
  const secret = Buff.str('alice').digest
  const client = new EscrowClient(secret, { host })
  const vector = vectors[0]

  list_contract_test(t, client)
  // await create_contract_test(t, client)
}

async function list_contract_test (t : Test, c : EscrowClient) {
  t.test('Test contract/index endpoint', async t => {
    t.plan(1)
    try {
      const res = await c.API.contract.list()
      if (!res.ok) {
        throw `API failed with error: ${res.err}`
      }
      const schema = ContractSchema.info.array()
      schema.parse(res.data)
      t.comment(`Data: ${res.data}` )
      t.pass('[PASS]: contract/index returned successfully.')
    } catch (err) {
      t.fail(`[FAIL]: ${err}`)
    }
  })
}

async function create_and_cancel_test (t : Test, c : EscrowClient) {

  const template = {
    title: 'Test contract',
    value      : 1000,
    expiration : 30,
    refund     : ''
  }

  t.test('Create and cancel a contract.', async t => {
    t.plan(1)

    try {
      const contract = await c.contract.create(template)
      contract.
    } catch (err) {
      t.fail(`[FAIL]: ${err}`)
    }

  })

  

  

  try {
    const ret = await c.API.contract.create(template)

    if (!ret.ok) {
      throw ret.err
    }

    assert_hash(ret.data.contract_id)
    
    const { title, admin } = ret.data.details

    if (
      typeof admin !== 'string' ||
      admin !== c.pubkey.hex
    ) {
      throw 'Admin key does not match user.'
    }

    if (title !== template.title) {
      throw 'Description does not match test vector.'
    }

    t.pass('Contract created successfully.')
  } catch (err) {
    t.fail(err)
  }
}
