import { EscrowClient }       from './Client.js'
import { EventEmitter }       from './Emitter.js'
import { AdminController }    from './Admin.js'
import { ClaimController }    from './Claim.js'
import { ContractParser }     from './Parser.js'
import { DepositController }  from './Deposit.js'
import { ProposalController } from './Proposal.js'
import { EscrowRouter }       from '../routes/index.js'
import { now }                from '../lib/utils.js'

import { 
  apply_defaults,
  ClaimData,
  ContractCreate,
  ContractData,
  AgentData,
  DepositData,
  ProposalData,
  TransactionData,
  EscrowConfig,
  EscrowOptions,
  SignerAPI
} from '../schema/index.js'

export class EscrowContract extends EventEmitter {

  static async create (
    signer   : SignerAPI, 
    template : ContractCreate,
    config  ?: EscrowConfig
  ) {
    const client = new EscrowClient(signer, config)
    const data   = await client.contract.create(template)
    return new EscrowContract(client, data, config)
  }

  static async fetch (
    signer     : SignerAPI, 
    contractId : string,
    config    ?: EscrowConfig
  ) {
    const client = new EscrowClient(signer, config)
    const data   = await client.contract.fetch(contractId)
    return new EscrowContract(client, data, config)
  }

  readonly _id     : string
  readonly _client : EscrowClient
  readonly _parser : ContractParser
  readonly opt     : EscrowOptions

  _cache    ?: ContractData
  updated_at : number

  constructor (
    client  : EscrowClient,
    data    : ContractData,
    config ?: EscrowConfig
  ) {
    super()
    this.opt        = apply_defaults(config)
    this._client    = client
    this._id        = data.contract_id
    this._parser    = new ContractParser(this)
    this._cache     = data
    this.updated_at = now()
  }

  get id () : string {
    return this._id
  }

  get signer () : SignerAPI {
    return this._client.signer
  }

  get API () : EscrowRouter {
    return this._client.API
  }

  get stale () : boolean {
    return this.updated_at + this.opt.cache_exp < now()
  }

  get data () : Promise<ContractData> {
    return this.cache()
  }

  get agent () : Promise<AgentData> {
    return this.data.then(res => res.agent)
  }

  get claims () : Promise<ClaimData[]> {
    return this.data.then(res => res.claims)
  }

  get deposits () : Promise<DepositData[]> {
    return this.data.then(res => res.deposits)
  }

  // get locks () : Promise<LockData[]> {
  //   return this.data.then(res => res.locks)
  // }

  get members () : Promise<string[]> {
    return this.proposals.then(res => res.map(e => e.pubkey))
  }

  get proposals () : Promise<ProposalData[]> {
    return this.data.then(res => res.proposals)
  }

  get transactions () : Promise<TransactionData[]> {
    return this.data.then(res => res.transactions)
  }

  // get votes () : Promise<VoteData[]> {
  //   return this.data.then(res => res.votes)
  // }

  async cache () {
    return (this._cache !== undefined && !this.stale)
      ? this._cache
      : this.fetch()
  }

  async fetch () {
    const API = this._client.API.contract
    const res = await API.read(this.id)
    if (!res.ok) throw new Error(res.err)
    const validData = await this._parser.parse(res.data)
    this._cache     = validData
    //  TODO:  Add history tracker array that syncs to localstore.
    this.updated_at = now()
    return validData
  }

  // async endorse () {
  //   const schedules = this.proposal.schedules
  //   for (const template of schedules) {
  //     const sighash = get_sighash(template)
  //     const sig = this.signer.sign(sighash)
  //   }
  // }

  admin   = new AdminController(this)
  deposit = new DepositController(this)
  dispute = new ClaimController(this)
  propose = new ProposalController(this)
  // tx        = new TxController(this)
}
