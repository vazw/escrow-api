# BitEscrow API

## Create a Signer

This library uses a separate signing API for producing signatures.

We need to pass this signer around in a few places in order to produce digital signatures.

```ts
import { createSigner } from '@cmdcode/escrow-api'

const signer = createSigner(secretKey)
```

The purpose of the signer is to allow plug-in support for an external hardware or software signing device. Feel free to replace the built-in signer with your own solution.

## Create a New Contract

To create a new contract on our platform, simply use the `create` method.

```ts
// Import the EscrowContract class.
import { EscrowContract } from '@cmdcode/escrow-api'
// We'll use this time value later.
const day = 60 * 60 * 24
// Create a draft contract by passing in a signer and template.
const contract = await EscrowContract.create(signer, {
  title : 'Example Escrow Contract',  // Specify a title for your contract.
  value : 100_000,                    // Total value of the contract (before agent and miner fees).
  alias : 'seller',                   // You can use a short alias for your pubkey.
  nonce : signer.generate(64),        // Generate a random nonce for this draft session.
  terms : {
    // Seller wants the contract to close after 1 week.
    details  : { duration: day * 7, onclose: 'payment' },
    // Seller is charging a non-refundable fee.
    fees     : [[ 10_000, 'bcp1selleraddress' ]],
    // Seller is receiving this payment on contract close.
    schedule : {
      payment : [[ 90_000, 'bcp1selleraddress' ]]
    }
  }
})
```

## Join an existing contract (in draft)

```ts
// You can fetch an existing contract via the contract Id.
const contract = EscrowContract.fetch(signer, contract_id)

contract.join({
  alias : 'buyer',
  nonce : signer.random(64),
  terms : {
    // Buyer wants to the contract to expire after two weeks.
    details : { expires: day * 14, onexpired: 'return' },
    // Buyer will receiving a return of funds in a dispute.
    schedule : {
      return : [[ 100_000, 'bcp1buyeraddress' ]]
    }
  }
})
```

## Reaching Consensus

In order to acheive consensus, all contract proposals must be identical.

**Seller**

```ts
// There is a conflict with the buyer's terms.
contract.conflicts = [ 'buyer_pubkey' ]
// Accept and copy over terms from the buyer.
contract.proposal.fromAlias('buyer').accept()
```

**Buyer**

```ts
// There is a conflict with the seller's terms.
contract.conflicts = [ 'seller_pubkey' ]
// Accept and copy over terms from the seller.
contract.proposal.fromAlias('seller').accept()
```

## Sign and Publish a Contract

In order to finalize and publish the contract, all members must provide signatures for each funding scenario.

```ts
// There should no longer be any conflicts with the buyer's terms.
contract.conflicts = []
contract.endorse()
```

Result:

```ts
contract.signatures = {
  { path : 'payment', pubkey : 'buyer_pub',  psigs, sighash },
  { path : 'return', pubkey : 'buyer_pub',  psigs, sighash },
  { path : 'payment', pubkey : 'seller_pub', psigs, sighash },
  { path : 'return', pubkey : 'seller_pub', psigs, sighash },
}
```

Once all signatures have been collected, the contract is marked as `published` and the terms are finalized. No further changes to the contract are allowed.

## Depositing Funds

To deposit funds into a contract, the user first requests a deposit address from the contract.

The deposit address is a taproot address constructed with the following parameters:
  * Internal pubkey is the aggregate key of all members + agent.
  * Tap scripts include all terms negotiated in the contract.
  * Relative time-lock set to contract expiration + grace period
  * Time-lock returns to the specified address.

```ts
contract.deposit({
  return  : 'bc1prefund', // Refund address for the deposit.
  value  ?: 100_000       // Generate an invoice with a specific value.
})
```

We can periodically check to see if the funds have been confirmed.

```ts
const res = await contract.check.deposits()

res = [{
  confirmed  : false,
  kind       : 'deposit',
  txid       : '1ae2dcf580324163e86c3eaa63e49a05229b3f4d420f5c17d736e73a427d836f',
  updated_at : 1688077240
}]
```

## Contract Settlement

The agent will auto-broadcast a closing transaction once all deposits have been confirmed, and the contract terms have been met.

**Duration**

```ts
terms = { details : { duration, onclose : 'payment' } }
contract.on('close', (contract) => {})
```

If the `duration` clause has been set, the agent will wait for the specified duration before closing the contract. This duration can be circumvented under the following conditions:

  - A dispute has been filed by a registered claimant.
  - A quorum has been reached by registered voters.
  - All required hash-locks have been revealed.

If no duration has been set, then the contract will close immediately after all signatures and deposits have been confirmed.

**Expiration**

```ts
terms = { details : { expires, grace, return_address, onexpired : 'return' } }
contract.on('expired', (contract) => {})
```

In the event that a contract is held open by dispute, a maximum duration can be set using the `expires` field. The default expiration setting on a contract is two weeks.

In addition to the contract expiration, each depositor can specify a return address. In the event of a total contract failure, depositors have a time-lock guarantee on the return of their funds.

The duration of this time-lock is the contract expiration plus the `grace` period. The default grace period is two days.

**Claims**

```ts
terms = { claimants : [ pubkey ] }

contract.claim.open(reason)
contract.claim.cancel(reason)

contract.on('claim_open',   (reason, claim) => {})
contract.on('claim_cancel', (reason, claim) => {})
```

**Hashlocks**

```ts
terms = { locks : [ { hash, onrelease : 'payout' } ] }

contract.lock.status(hash)
contract.lock.release(preimage)

contract.on('lock_release', (preimage, lock) => {})
```

**Quorum**

```ts
terms = { quorum : { members : [[ pubkey, weight ]], size } }

contract.vote.cast(label)
contract.vote.remove(label)

contract.on('vote_cast',    (label, vote) => {})
contract.on('vote_removed', (label, vote) => {})
```

**Closing**

You can manually check to see if a contract is ready to be closed by calling the `close` method.

```ts
const res = await contract.close()

res = {}
```

## Handling Disputes

```ts
const claim = contract.claim.byAlias('buyer')

claim.accept(reason)
claim.reject(reason)

contract.on('claim_accepted' (reason, claim) => {})
contract.on('claim_rejected' (reason, claim) => {})
```

## Interfaces

```ts
interface ContractData {
  // Basic information.
  id       : string    // Randomly generated id.
  access   : string[]  // Pubkeys which can view and join the contract.
  admin    : string    // Pubkey that has admin priviliges.
  created  : number    // Timestamp of when contract was created.
  updated  : number    // Timestamp of when contract was last updated.

  agent    : {
    // Agent information.
    pubkey : string    // Pubkey of the agent.
    nonce  : string    // Root nonce of the agent.
    fees   : Payout[]  // Fees required for the agent to sign.
  }

  deposits : [{
    // Deposit information.
    return : string    // Return address for the deposit.
    txid   : string    // Transaction ID of the UTXO.
    vout   : number    // Output index of the UTXO.
    value  : number    // Value of the UTXO.
  }]

  info : {
    // Contract information.
    title   : string    // For briefly describing the contract.
    desc    : string    // Field for including detailed information.
    network : string    // The network to use for the contract.
    private : boolean   // Flags whether contract is publicly searchable.
    value   : number    // Total value of the contract.
  }

  // List of member proposals.
  members  : Proposal[]

  session  : {
    // Session information.
    secret  : string      // Random secret (for use in external protocols).
    pubkey  : string      // Aggregated public key of all members.
    nonce   : string      // Aggregated public nonce of all members.
    scripts : string[][]  // Collective scripts of all terms in effect.
    taproot : string      // Calculated taproot of all records and scripts.
    terms  ?: TermData    // Final terms of the contract.
    txdata  : string      // Transaction with all inputs and outputs (no witness).
  },

  signatures : [{
    // Signature information.
    event  : string
    psig   : string  // Signature hex.
    pubkey : string  // Public key of signature.
    txdata : string  // Transaction being signed.
  }]

  transactions : [{
    // Transaction information.
    kind      : 'deposit' | 'spend'
    txid      : string    // Transaction ID.
    confirmed : boolean   // Flags whether transaction is confirmed.
    txdata    : string    // Transaction data (in hex).
    updated   : number    // Timestamp of last update.
  }]
}

interface ProposalData {
  id      : string  // Hash ID of the proposal.
  sig     : string  // Signature attesting to the hash ID.
  created : number  // Creation date of the proposal.

  alias   : string  // Human-readable name for the member.
  pubkey  : string  // Public key of the member.
  nonce   : string  // Nonce value of the member.

  terms : {
    // A hash of the contract terms.
    hash : string

    // Claimants have the ability to dispute the contract.
    claimants : string[]

    // Details of the contract.
    details : {
      duration : number  // Duration for the agent to withold signing.
      expires  : number  // Duration until deposits expire and are refunded.
      grace    : number  // Extra grace period on deposits once contract expires.
      onclose  : string  // Payment path that agent should execute on closing.
      onexpire : string  // Payment path that agent should execute on expiration.
      refund   : string  // Specify a dedicated refund output for the contract.
    }

    // Fees are payable under any payment outcome.
    fees     : [{ address: string, value: number }]
    // Locks can be used to release a payment.
    locks    : [{ hash : string, onrelease : 'payout' }]

    // A quorum of votes can be used to release a payment.
    quorum  : {           
      // Public keys that can vote. Default weight is 1.
      members : [{ pubkey : string, weight : number }]
      // Minimum value that must be reached.
      size : number
    }

    // Data records are endorsed by the contract signature.
    records : [{ label : string, content : string }]

    // List of payment schedules that can be executed.
    schedule : {
      payments : [{ value: number, address: string }]
      returns  : [{ value: number, address: string }]
    }
  }
}
```

## Client API Reference

```ts
let client = new EscrowClient(signer)

client.API = {
  access : {
    update  : (id : string, pubkeys : string)                  => Promise<ResponseAPI>,
    remove  : (id : string, pubkeys : string[])                => Promise<ResponseAPI>
  },
  check  : {
    deposits     : ()                                          => Promise<DepositData[]>,
    transactions : ()                                          => Promise<TransactionData[]>
  },
  contract : {
    create : (template : ContractCreate)                       => Promise<ContractData>,
    fetch  : (id : string)                                     => Promise<ContractData>,
    update : (id : string, template : ContractTemplate)        => Promise<ResponseAPI>,
    cancel : (id : string)                                     => Promise<ResponseAPI>
  },
  claims: {
    action : (id : string, cid : string, action : ClaimAction) => Promise<ResponseAPI>,
    fetch  : (id : string)                                     => Promise<ClaimData[]>,
    update : (id : string, template : ClaimTemplate)           => Promise<ResponseAPI>,
    remove : (id : string)                                     => Promise<ResponseAPI>
  },
  locks: {
    fetch  : (id : string)                                     => Promise<LockData[]>,
    update : (id : string, template : LockTemplate)            => Promise<ResponseAPI>,
    // remove : (id: string, label    : string)                => Promise<ResponseAPI>
  },
  proposals : {    
    fetch   : ()                                               => Promise<ProposalData[]>,
    update  : (id : string, template: ProfileTemplate)         => Promise<ResponseAPI>,
    remove  : (id : string)                                    => Promise<ResponseAPI>
  },
  signatures: {
    fetch  : (id : string)                                     => Promise<SignatureData[]>,
    update : (id : string, template: SignatureTemplate)        => Promise<ResponseAPI>,
    remove : (id : string)                                     => Promise<ResponseAPI>
  },
  votes: {
    fetch  : (id : string)                                     => Promise<VoteData[]>,
    update : (id : string, template : VoteTemplate)            => Promise<ResponseAPI>,
    remove : (id : string, label    : string)                  => Promise<ResponseAPI>
  },
}
```

## Contract API Reference

```ts
const contract = new EscrowContract(client, contract_id)

contract = {
  id     : string,
  info   : Promise<ContractDetails>,
  pubkey : string,

  claims       : Promise<Claim[]>,
  deposits     : Promise<Deposit[]>,
  locks        : Promise<Lock[]>,
  proposals    : Promise<Proposal[]>,
  session      : Promise<ContractSession>,
  signatures   : Promise<Signature[]>,
  transactions : Promise<Transaction[]>,
  votes        : Promise<Vote[]>,

  // Close the contract (if conditions are met).
  close   : () => Promise<string>,
  // Request a deposit address (publish stage).
  deposit : () => Promise<string>,
  // Fetch contract data.
  fetch   : () => Promise<ContractData>,
  // Join the contract (draft stage).
  join    : () => Promise<Proposal>,
  // Leave the contract (draft stage).
  leave   : () => void,

  // These options are only available 
  // during the draft stage of a contract.
  access : {
    // Add pubkeys to the member list.
    add    (pubkeys : string[]) : Promise<string[]>,
    // Remove pubkeys from the member list.
    remove (pubkeys : string[]) : Promise<string[]>,
  },

  // These options are only available 
  // during the draft stage of a contract.
  admin : {
    // Cancel the contract.
    cancel ()
    // Transfer admin rights to another key.
    transfer()
    // Update the details of the contract.
    update ()
  },

  agent : {
    
  }

  check : {
    deposits()
    transactions()
  },

  claim : {
    data   : Claim,
    open   : () => Claim,
    cancel : () => void
  },

  lock : {
    release : (preimage : string) => void
  },

  proposal : {
    data   : Proposal,
    update : (template : ProposalTemplate) => Promise<ProposalData>,
    remove : () => Promise<void>
  },

  signature : {
    data    : SignatureData,
    endorse : () => Promise<SignatureData>,
    remove  : () => Promise<void>
  },

  vote : {
    data   : VoteData, 
    cast   : () => Promise<VoteData>,
    remove : () => Promise<void>
  }
}
```
## Claim API Reference

```ts
const claim = contract.claim.byAlias('buyer')

claim = {
  data
  accept() // Accept the claim.
  reject() // Reject the claim.
  cancel() // Cancel your vote.
}

interface ClaimData {
  id         : string
  sig        : string
  created_at : number
  pubkey     : string
  reason     : string
  notes      : string
  comments   : ClaimAction[]
}

interface ClaimAction {
  id         : string
  sig        : string
  created_at : number
  pubkey     : string
  action     : 'accept' | 'reject'
  comment    : string
}
```

## Proposal API Reference

```ts
const proposal = contract.proposal.byAlias('buyer')

proposal = {
  conflicts
  data
  accept()
}
```

## Signer API Reference

```ts
export interface SignerAPI {
  // Provides the public key for the signer.
  pubkey   : string
  // Generate a new Signer using an HMAC plus seed.
  generate : (seed : Bytes)  => SignerAPI
  // Perform an HMAC signing operation.
  hmac     : (msg : Bytes)  => string
  // Produce a partial musig2 signature.
  musign   : (challenge : Bytes, nonces : Bytes[], vectors : Bytes[]) => string
  // Produce a random cryptographic seed.
  random   : (size ?: number) => string
  // Produce a BIP0340 signature using the interal secret.
  sign     : (msg   : Bytes)  => string
  // Verify a BIP0340 signature and pubkey.
  verify   : (sig : Bytes, msg : Bytes, pub : Bytes) => boolean
}
```
