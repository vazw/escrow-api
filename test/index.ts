import tape from 'tape'
import { contract_test } from './src/contract/contract.test.js'

tape('Escrow API testing suite.', async t => {
  await contract_test(t)
})
