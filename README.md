# BitEscrow API

## Create a client.

```ts
import { EscrowClient } from '@cmdcode/escrow-api'
// Create a secret key.
const secret = Buff.str('alice').digest
// Create a client object using a secret key.
const client = new EscrowAPI(secret)
// You can view the pubkey and access the API tools directly.
const { API, fetch, pubkey, sign } = client
```

## Create a contract

```ts
import { EscrowContract } from '@cmdcode/escrow-api'
// Create a contract using a client and template.
const contract = await EscrowContract.create(client, {
  title : 'Example Escrow Contract'
})
```

## Client API Reference

```ts
let client = new EscrowClient(secret)

client.API = {
  contract : {
    list   : ()                                               => Promise<ResponseAPI<ContractData[]>>,
    create : (template: ContractCreate)                       => Promise<ResponseAPI<ContractData>>,
    read   : (contractId: string)                             => Promise<ResponseAPI<ContractData>>,
    prune  : ()                                               => Promise<ResponseAPI>,
    update : (contractId: string, template: ContractTemplate) => Promise<ResponseAPI>,
    cancel : (contractId: string)                             => Promise<ResponseAPI>
  },
  endorse: {
    update : (contractId: string, endorsement: string)        => Promise<ResponseAPI>,
    remove : (contractId: string)                             => Promise<ResponseAPI>
  },
  members: {
    update : (contractId: string, members: string[])          => Promise<ResponseAPI>,
    remove : (contractId: string, members: string[])          => Promise<ResponseAPI>
  },
  profile : {    
    list    : ()                                              => Promise<ResponseAPI<ProfileData[]>>,
    read    : (contractId: string)                            => Promise<ResponseAPI<ProfileData>>,
    update  : (contractId: string, template: ProfileTemplate) => Promise<ResponseAPI>,
    remove  : (contractId: string)                            => Promise<ResponseAPI>,
    clear   : ()                                              => Promise<ResponseAPI>,
    tags : {
      update: (contractId: string, records: ProfileRecord[])  => Promise<ResponseAPI>,
      remove: (contractId: string, labels: string[])          => Promise<ResponseAPI>
    }
  },
  records: {
    update : (contractId: string, records: RecordTemplate[]) => Promise<ResponseAPI>,
    remove : (contractId: string, queries: RecordQuery[])    => Promise<ResponseAPI>
  },
  sign: {
    list   : (contractId: string)                            => Promise<ResponseAPI<SignatureData[]>>,
    update : (contractId: string, signature: string)         => Promise<ResponseAPI>,
    remove : (contractId: string)                            => Promise<ResponseAPI>
  }
}
```

```ts
// Main ContractData object.
interface ContractData {
  contract_id : string
  members     : string[]
  status      : "draft" | "published" | "active" | "disputed" | "closed"
  revision    : number
  created_at  : Date
  updated_at  : Date

  claims: ClaimData[] {

    data    : string[]
    methods : string[]
    params  : string[]
    value   : number
  }

  data: {

  }

  details: {
    // Contract info is editable by the admin.
    updated_at : Date
    title      : string
    admin      : string
    agent      : string
    desc      ?: string | undefined
    terms     ?: string | undefined
  }

  endorsements : EndorseData[] {
    // Collect signed endorsements from other members.
    updated_at : Date
    pubkey     : string
    hash       : string
    signature  : string
  }

  fees: PaymentData[] {
    address : string
    note   ?: string
    value   : number
  }

  meta: {
    // Metadata is updated by the server.
    block_id    : string
    open_txid  ?: string | undefined
    close_txid ?: string | undefined
  }

  payments: PaymentData[] {
    address : string
    note   ?: string
    value   : number
  }

  room: {
    // This data is for collaboration and signing.
    secret     : string
    nonce     ?: string | undefined
    pubkey    ?: string | undefined
    hash      ?: string | undefined
  }

  profiles: {
    // Each member manages their own profile data.
    updated_at : Date
    pubkey     : string
    nonce      : string
    alias      : string
  }[]
  records: {
    // All members can manage records for the contract.
    updated_at : Date
    pubkey     : string
    label      : string
    kind       : "data" | "script" | "term"
    content    : string[]
  }[]
  signatures: {
    updated_at : Date
    kind       : "claim" | "settle"
    outputs    : string[]
    pubkey     : string
    sighash    : string
    txhex      : string
    psig       : string
  }[]
  transactions: string[]
}

interface PaymentData {
  address : string
  note   ?: string
  value   : number
}

interface CoinLock {
  method  : string
  params  : string[]
  version : string
}
```
## EscrowContract API Reference

```ts
const contract = new EscrowContract(client, contract_id)

let contract = {
  cid          : string,
  API          : ContractRouter,
  pubkey       : string,
  data         : Promise<ContractData>,
  endorsements : Promise<EndorseData[]>,
  members      : Promise<string[]>,
  profiles     : Promise<ProfileData[]>,
  signatures   : Promise<SignatureData[]>

  fetch () => Promise<ContractData>
  
  endorse : {
    API : EndorseRouter,
    add (hash ?: string) : Promise<EndorseData>
    remove()             : Promise<EndorseData | undefined>
  }

  member : {
    API : MembersRouter,
    add    (member: string)    : Promise<string[]>,
    remove (member: string)    : Promise<string[]>,
    update (members: string[]) : Promise<string[]>,
    delete (members: string[]) : Promise<string[]>
  }

  profile : {
    API    : ProfileRouter,
    pubkey : string,
    data   : Promise<ProfileData | undefined>,
    update (template: ProfileTemplate) : Promise<ProfileData | undefined>,
    remove ()                          : Promise<ProfileData | undefined>
  }

  signature : {
    API : SignatureRouter,
    add (hash ?: string) : Promise<SignatureData | undefined>
    remove ()            : Promise<SignatureData | undefined>
  }
}
```