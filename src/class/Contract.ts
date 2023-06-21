import { EscrowClient }        from '..'
import { MemberController }    from './Member.js'
import { ProfileController }   from './Profile.js'
import { SignatureController } from './Signature.js'

import { 
  ContractCreate,
  ContractData,
  EndorseData,
  ProfileData,
  SignatureData
} from '../schema/index.js'

interface ContractConfig {
  init_data ?: ContractData
  cache_exp  : number
}

const DEFAULT_CONFIG = {
  cache_exp : 1000 * 60 * 5
}

export class EscrowContract {

  static async create (
    client   : EscrowClient, 
    template : ContractCreate
  ) {
    const API = client.API.contract
    const res = await API.create(template)
    if (!res.ok) throw new Error(res.err)
    const cid = res.data.contract_id
    return new EscrowContract(client, cid, { init_data: res.data })
  }

  readonly _cid    : string
  readonly _client : EscrowClient
  readonly config  : ContractConfig

  _cache          ?: ContractData
  refreshed_at    ?: Date

  constructor (
    client     : EscrowClient,
    contractId : string,
    config     : Partial<ContractConfig> = {}
  ) {
    this.config       = { ...DEFAULT_CONFIG, ...config }
    this._client      = client
    this._cid         = contractId
    this._cache       = config.init_data
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
    this._cache = res.data
    this.refreshed_at = new Date()
    return res.data
  }

  member    = new MemberController(this)
  profile   = new ProfileController(this)
  signature = new SignatureController(this)
}
