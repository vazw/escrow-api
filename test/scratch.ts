import { Buff } from '@cmdcode/buff-utils'
import { EscrowClient, EscrowContract } from '../src/index.js'

const host    = 'http://localhost:3000'
const secret  = Buff.str('alice').digest

const client = new EscrowClient(secret)
const cid    = 'bcdcc755d88f7438f2fe8577c7188c3f188386dac48ecbc3125ded1ae157b034'

const contract = new EscrowContract(client, cid)

const profiles = await contract.profiles

console.log('current:', profiles)

// const res = await contract.profile.update({ alias: 'Alice', nonce: Buff.random(64).hex })

// const self = await contract.profile.data

// console.log('self:', res, self)



// const createBody : ContractCreate = {
//   title   : 'This is a test 3',
//   description : 'this is a description',
//   profile : {
//     alias : 'admin',
//     nonce : Buff.random(64).hex
//   },
//   records: [{
//     kind    : 'script',
//     label   : 'test',
//     content : [ 'OP_RETURN' ]
//   }]
// }

// const recordUpdate : RecordTemplate[] = [
//   { kind: 'data', label: 'address', content: ['deadbeef']},
//   { kind: 'term', label: 'expiration', content: ['30d'] }
// ]

// const recordRemove : RecordQuery[] = [
//   { kind: 'data', label: 'address' },
//   { kind: 'term', label: 'expiration' }
// ]

// const profile : ProfileTemplate = {
//   alias: 'Bob',
//   nonce: Buff.random(64).hex,
// }

// const res = await client.API.contract.read(
//   'bcdcc755d88f7438f2fe8577c7188c3f188386dac48ecbc3125ded1ae157b034'
// )

// if (!res.ok) {
//   console.log(res.err)
// } else {
//   const { data } = res
//   console.log(data.records[0])
// }
