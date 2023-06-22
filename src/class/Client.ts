import { Buff, Bytes }     from '@cmdcode/buff-utils'
import { SecretKey, sign } from '@cmdcode/crypto-utils'
import { EscrowRouter }    from '../routes/index.js'
import { createFetch }     from '../fetch2.js'
import { EscrowContract }  from './Contract.js'
import { ContractConfig }  from '../schema/types.js'

type Fetcher = (secret : Bytes) => typeof fetch
type Signer  = (secret : Bytes, message : Bytes) => Bytes
type Sign    = (message : Bytes) => Bytes

interface EscrowConfig {
  host     : string
  fetcher ?: Fetcher
  signer  ?: Signer
}

const DEFAULT_CONFIG = {
  host: 'http://localhost:3000'
}

export class EscrowClient {
  readonly _secret : Buff
  readonly options : EscrowConfig
  readonly API     : EscrowRouter
  readonly fetch   : typeof fetch
  readonly sign    : Sign

  constructor (
    secret : Bytes,
    config : Partial<EscrowConfig> = {}
  ) {
    const opt = { ...DEFAULT_CONFIG, ...config }
    const { host, fetcher, signer } = opt

    this.options = opt
    this._secret = Buff.bytes(secret)

    this.fetch = (fetcher !== undefined)
      ? fetcher(secret)
      : createFetch(secret)

    this.sign  = (signer !== undefined)
      ? (message : Bytes) => signer(secret, message)
      : (message : Bytes) => sign(secret, message, 'taproot')

    this.API = new EscrowRouter(host, this.fetch)
  }

  get pubkey () : Buff {
    return new SecretKey(this._secret).pub.x
  }

  async getContract (
    contractId : string,
    config    ?: Partial<ContractConfig>
  ) : Promise<EscrowContract | undefined> {
    const API = this.API.contract
    const res = await API.read(contractId)
    return (res.ok)
      ? new EscrowContract(this, res.data, config)
      : undefined
  }
}
