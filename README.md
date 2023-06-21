# BitEscrow API

```ts
const client = new EscrowAPI(secret)

const { pubkey, API } = client

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
```