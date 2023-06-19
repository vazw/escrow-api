import { Buff } from '@cmdcode/buff-utils'
import { EscrowAPI } from '../src/index.js'

const host    = 'http://localhost:3000'
const secret  = Buff.str('alice').digest

const client = new EscrowAPI(secret)

const res = await client.API.contract.read('683bc7f19b4ccbfc8e8eb5ae6c7f7d844725b679401dee648adc3588f8ecfbe1')

if (!res.ok) {
  throw `${res.status} ${res.statusText}`
}

console.log(await res.json())
