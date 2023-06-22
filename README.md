# BitEscrow API

## Create a client.

```ts
import { EscrowClient } from '@cmdcode/escrow-api'
// Create a secret key.
const secret = Buff.str('alice').digest
// Create a client object using a secret key.
const client = new EscrowAPI(secret)
// You can view the pubkey and access the API tools directly.
const { API, pubkey } = client
// You can fetch a contract by Id.
const contract = await client.getContract(contract_id)
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

  // Claim outputs show pending closing tx.
  claims       : Promise<ClaimData[]>,
  // Deposit inputs are used in the closing tx.
  deposits     : Promise<DepositData[]>,
  details      : Promise<ContractInfo>,
  endorsements : Promise<EndorseData[]>,
  // Fee outputs are used in the closing tx.
  fees         : Promise<FeeData[]>,
  members      : Promise<Map<string, ProfileData>>,
  meta         : Promise<ContractMeta>,
  // Payment outputs are used in the closing tx.
  payments     : Promise<PaymentData[]>,
  records      : Promise<RecordData[]>,
  scripts      : Promise<ScriptData[]>,
  // If enough signature are collected, and the
  // closing tx covers the required payment and fees,
  // the escrow agent should auto-sign.
  signatures   : Promise<SignatureData[]>,
  // All transactions tied to the contract are here.
  transactions : Promise<TransactionData[]>

  fetch () => Promise<ContractData>

  join()
  leave()

  // These options are only available 
  // during the draft stage of a contract.
  access : {
    // Add pubkeys to the member list.
    add    (pubkeys : string[]) : Promise<string[]>,
    // Remove pubkeys from the member list.
    remove (pubkeys : string[]) : Promise<string[]>,
  }

  // These options are only available 
  // during the draft stage of a contract.
  admin : {
    // Cancel the contract.
    cancel ()
    // Transfer admin rights to another key.
    transfer()
    // Update the details of the contract.
    update ()
  }

  check : {
    claims()
    deposits()
  }

  data : {
    // Add a record to the contract output.
    add()
    // Remove a record from the contract output.
    remove()
  }

  endorse : {
    API : EndorseRouter,
    list
    add (hash ?: string) : Promise<EndorseData>
    remove()             : Promise<EndorseData | undefined>
  }

  payment : {
    // Add a payment output.
    add()
    // Remove a payment output.
    remove()
  }

  profile : {
    data : Promise<ProfileData | undefined>,
    update (template: ProfileTemplate) : Promise<ProfileData | undefined>,
    tag  : {
      add()
      remove()
    }
  }

  script : {
    // Add a custom script to the contract output.
    add()
    // Remove a custom script from the contract output.
    remove()
  }

  signature : {
    data
    add (hash ?: string) : Promise<SignatureData | undefined>
    remove ()            : Promise<SignatureData | undefined>
  }
}
```