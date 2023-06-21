import { Buff } from '@cmdcode/buff-utils'
import { EscrowAPI, ContractCreate, RecordTemplate, RecordData, ProfileTemplate } from '../src/index.js'

const host    = 'http://localhost:3000'
const secret  = Buff.str('alice').digest

const client = new EscrowAPI(secret)

const createBody : ContractCreate = {
  title   : 'This is a test 3',
  description : 'this is a description',
  profile : {
    alias : 'admin',
    nonce : Buff.random(64).hex
  },
  records: [{
    kind    : 'script',
    label   : 'test',
    content : [ 'OP_RETURN' ]
  }]
}

const recordUpdate : RecordTemplate[] = [
  { kind: 'data', label: 'address', content: ['deadbeef']},
  { kind: 'term', label: 'expiration', content: ['30d'] }
]

const recordRemove : RecordQuery[] = [
  { kind: 'data', label: 'address' },
  { kind: 'term', label: 'expiration' }
]

const profile : ProfileTemplate = {
  alias: 'Bob',
  nonce: Buff.random(64).hex,
}

const res = await client.API.profile.read(
  'bcdcc755d88f7438f2fe8577c7188c3f188386dac48ecbc3125ded1ae157b034'
)

if (!res.ok) {
  throw `${res.status} ${res.statusText}`
}

const response = await res.json()

console.log(JSON.stringify(response.data, null, 2))

