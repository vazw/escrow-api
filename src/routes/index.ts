import { ContractRouter }  from './contract.js'
import { EndorseRouter }   from './endorse.js'
import { MembersRouter }   from './members.js'
import { ProfileRouter }   from './profile.js'
import { RecordRouter }    from './records.js'
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

  get endorse () {
    return new EndorseRouter(this.host, this.fetch)
  }

  get members () {
    return new MembersRouter(this.host, this.fetch)
  }

  get profile () {
    return new ProfileRouter(this.host, this.fetch)
  }

  get records () {
    return new RecordRouter(this.host, this.fetch)
  }

  get signatures () {
    return new SignatureRouter(this.host, this.fetch)
  }
}
