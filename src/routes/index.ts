import { ContractRouter } from './contract.js'
import { ProfileRouter }   from './profile.js'

type Fetcher = typeof fetch

export class EscrowRouter {
  readonly host  : string
  readonly fetch : Fetcher

  readonly _router  : ContractRouter
  readonly _profile : ProfileRouter

  constructor (
    hostname : string,
    fetcher  : Fetcher
  ) {
    this.host     = hostname
    this.fetch    = fetcher
    this._router  = new ContractRouter(this.host, this.fetch)
    this._profile = new ProfileRouter(this.host, this.fetch)
  }

  get contract () {
    return this._router.contract
  }

  get endorse () {
    return this._router.endorse
  }

  get members () {
    return this._router.members
  }

  get profile () {
    return this._profile
  }

  get records () {
    return this._router.records
  }

  get sign () {
    return this._router.sign
  }
}
