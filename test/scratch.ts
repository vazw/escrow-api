import { Buff }     from '@cmdcode/buff-utils'
import { TermData, TermTemplate } from '../src/index.js'
import { aggregate_terms } from '../src/lib/utils.js'

const terms : TermData[] = [
  {
    pubkey   : '1ae2dcf580324163e86c3eaa63e49a05229b3f4d420f5c17d736e73a427d836f',
    details  : { duration : 60 * 60 * 2 },
    fees     : [
      [ 10_000, 'bcp1fee', 'fee' ]
    ],
    payments : [
      [ 90_000, 'bcp1pay', 'payout' ]
    ]
  },
  {
    pubkey  : '3401b5ebe608924f3f7212bd42e5fa2d9931cf9bcc4c925835c5e04a725d158d',
    details : { expires: 60 * 60 * 5 },
    returns : [
      [ 90_000, 'bcp1ret', 'return' ]
    ]
  }
]


const ret = aggregate_terms(terms)

console.log(ret)
