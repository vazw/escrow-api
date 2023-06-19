import tape from 'tape'
import { contract_test } from './src/contract.test.js'

tape('Escrow API testing suite.', t => {
  contract_test(t)
})