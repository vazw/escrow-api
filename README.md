# BitEscrow API

```ts
// Create a client object with a secret key.
const client = new EscrowAPI(secret)
// You can view the pubkey and access the API.
const { pubkey, API } = client
// Full API details.
const API = {
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
    records : {
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
  info: {
    // Contract info is editable by the admin.
    title  : string
    admin  : string
    agent  : string
    desc  ?: string | undefined
    terms ?: string | undefined
  }
  meta: {
    // Metadata is updated by the server.
    block_id    : string
    open_txid  ?: string | undefined
    close_txid ?: string | undefined
  }
  outputs: {
    data    : string[]
    methods : string[]
    scripts : string[]
    value   : number
  }[]
  room: {
    // This data is for collaboration and signing.
    secret     : string
    nonce     ?: string | undefined
    pubkey    ?: string | undefined
    hash      ?: string | undefined
  }
  endorsements : {
    // Collect signed endorsements from other members.
    updated_at : Date
    pubkey     : string
    hash       : string
    signature  : string
  }[]
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

interface CoinLock {
  method  : string
  params  : string[]
  version : string
}
```