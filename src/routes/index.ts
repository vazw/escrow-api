import { ContractRouter }  from './contract.js'
import { MembersRouter }   from './access.js'
import { ProfileRouter }   from './propose.js'
import { SignatureRouter } from './signatures.js'

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

  get contract () {
    return new ContractRouter(this.host, this.fetch)
  }

  get members () {
    return new MembersRouter(this.host, this.fetch)
  }

  get proposal () {
    return new ProfileRouter(this.host, this.fetch)
  }

  get signatures () {
    return new SignatureRouter(this.host, this.fetch)
  }
}
