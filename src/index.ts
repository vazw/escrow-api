import { Buff, Bytes }  from '@cmdcode/buff-utils'
import { EscrowRouter } from './routes/index.js'
import { createFetch }  from './fetch2.js'
import { SecretKey } from '@cmdcode/crypto-utils'

export * from './schema/index.js'

type Fetcher = (secret : Bytes) => typeof fetch

interface EscrowConfig {
  host     : string
  fetcher ?: Fetcher
}

const DEFAULT_CONFIG = {
  host: 'http://localhost:3000'
}

export class EscrowAPI {
  readonly _secret : Buff
  readonly options : EscrowConfig
  readonly fetch   : typeof fetch
  readonly API     : EscrowRouter

  constructor (
    secret : Bytes,
    config : Partial<EscrowConfig> = {}
  ) {
    const opt = { ...DEFAULT_CONFIG, ...config }
    const { fetcher, host } = opt

    this.options = opt
    this._secret = Buff.bytes(secret)

    this.fetch = (fetcher !== undefined)
      ? fetcher(secret)
      : createFetch(secret)

    this.API = new EscrowRouter(host, this.fetch)
  }

  get pubkey () : Buff {
    return new SecretKey(this._secret).pub.x
  }
}
