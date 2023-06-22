import { EscrowClient }        from '..'
import { EventEmitter }        from './Emitter.js'
import { MemberController }    from './Member.js'
import { ContractParser }      from './Parser.js'
import { ProfileController }   from './Profile.js'
import { SignatureController } from './Signature.js'

import { 
  ContractConfig,
  ContractCreate,
  ContractData,
  EndorseData,
  ProfileData,
  SignatureData
} from '../schema/index.js'

const DEFAULT_CONFIG = {
  cache_exp : 1000 * 60 * 5
}

export class EscrowContract extends EventEmitter {

  static async create (
    client   : EscrowClient, 
    template : ContractCreate,
    config   : Partial<ContractConfig> = {}
  ) {
    const API = client.API.contract
    const res = await API.create(template)
    if (!res.ok) throw new Error(res.err)
    return new EscrowContract(client, res.data, config)
  }

  readonly _cid    : string
  readonly _client : EscrowClient
  readonly _parser : ContractParser
  readonly config  : ContractConfig

  _cache          ?: ContractData
  refreshed_at    ?: Date

  constructor (
    client   : EscrowClient,
    contract : ContractData,
    config   : Partial<ContractConfig> = {}
  ) {
    super()
    this.config       = { ...DEFAULT_CONFIG, ...config }
    this._client      = client
    this._cid         = contract.contract_id
    this._cache       = contract
    this._parser      = new ContractParser(this)
    this.refreshed_at = undefined
  }

  get cid () : string {
    return this._cid
  }

  get API () {
    return this._client.API.contract
  }

  get pubkey () : string {
    return this._client.pubkey.hex
  }

  get data () : Promise<ContractData> {
    return this.cache()
  }

  get endorsements () : Promise<EndorseData[]> {
    return this.data.then(res => res.endorsements)
  }

  get members () : Promise<string[]> {
    return this.data.then(res => res.members)
  }

  get profiles () : Promise<ProfileData[]> {
    return this.data.then(res => res.profiles)
  }

  get signatures () : Promise<SignatureData[]> {
    return this.data.then(res => res.signatures)
  }

  async cache () {
    return (this._cache !== undefined)
      ? this._cache
      : this.fetch()
  }

  async fetch () {
    const res = await this.API.read(this.cid)
    if (!res.ok) throw new Error(res.err)
    const ret = await this._parser.parse(res.data)
    this._cache = ret
    this.refreshed_at = new Date()
    return res.data
  }

  member    = new MemberController(this)
  profile   = new ProfileController(this)
  signature = new SignatureController(this)
}
