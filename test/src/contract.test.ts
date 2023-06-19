import { Test }      from 'tape'
import { Buff }      from '@cmdcode/buff-utils'
import { EscrowAPI } from '../../src/index.js'

import vectors from './vectors.json' assert { type: 'json' }
import { assert_hash } from '../../src/lib/assert.js'

type Vector = typeof vectors[0]

export async function contract_test (t : Test) {
  const host   = 'http://localhost:3000'
  const secret = Buff.str('alice').digest
  const client = new EscrowAPI(secret, { host })
  const vector = vectors[0]

  list_contract_test(t, client)
  // await create_contract_test(t, client)
}

async function list_contract_test (t : Test, c : EscrowAPI) {
  const res = await c.API.contract.list()

  if (res.ok) {
    console.log(await res.json())
  }

  t.plan(1)
  t.pass()

}

async function create_contract_test (t : Test, c : EscrowAPI) {

  const template = {
    description: 'This is a test!'
  }

  t.plan(1)

  try {
    const ret = await c.API.contract.create(template)

    if (!ret.ok) {
      throw (`${ret.status} ${ret.statusText}`)
    }

    const { data, err } = await ret.json()

    if (err !== undefined) throw err

    assert_hash(data.id)
    
    const { description, moderator } = data.info

    if (
      typeof moderator !== 'string' ||
      moderator !== c.pubkey.hex
    ) {
      throw 'Admin key does not match user.'
    }

    if (description !== template.description) {
      throw 'Description does not match test vector.'
    }

    t.pass('Contract created successfully.')
  } catch (err) {
    t.fail(err)
  }
}
