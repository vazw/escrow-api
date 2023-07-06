
import { AccessRouter }   from './access.js'
import { AdminRouter }    from './admin.js'
import { ClaimRouter }    from './claim.js'
import { DepositRouter }  from './deposit.js'
import { ContractRouter } from './contract.js'
import { ProposalRouter } from './proposal.js'

type Fetcher = typeof fetch

export class EscrowRouter {
  readonly host  : string
  readonly fetch : Fetcher

  constructor (
    hostname : string,
    fetcher  : Fetcher
  ) {
    this.host     = hostname
    this.fetch    = fetcher
  }

  get access () {
    return new AccessRouter(this.host, this.fetch)
  }

  get admin () {
    return new AdminRouter(this.host, this.fetch)
  }

  get claim () {
    return new ClaimRouter(this.host, this.fetch)
  }

  get contract () {
    return new ContractRouter(this.host, this.fetch)
  }

  get deposit () {
    return new DepositRouter(this.host, this.fetch)
  }

  get proposal () {
    return new ProposalRouter(this.host, this.fetch)
  }
}
