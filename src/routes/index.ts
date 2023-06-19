import { ContractRouter } from './contract.js'
import { ProfileRouter }   from './profile.js'

type Fetcher = typeof fetch

export class EscrowRouter {
  readonly host  : string
  readonly fetch : Fetcher

  readonly contract : ContractRouter
  readonly profile  : ProfileRouter

  constructor (
    hostname : string,
    fetcher  : Fetcher
  ) {
    this.host  = hostname
    this.fetch = fetcher

    this.contract = new ContractRouter(this.host, this.fetch)
    this.profile  = new ProfileRouter(this.host, this.fetch)
  }
}
