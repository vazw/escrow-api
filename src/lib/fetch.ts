// Need fetcher and middleware for handling user sessions.
import { Buff }        from '@cmdcode/buff-utils'
import { verify as V } from '@cmdcode/crypto-utils'
import { SignerAPI }   from '../schema/index.js'

interface SessionConfig {
  host    ?: string
  timeout : number
  throws  : boolean
}

interface Token {
  pubkey : Buff
  sig    : Buff
  time   : Buff
}

const LOG_TOKENS = false

const DEFAULT_CONFIG : SessionConfig = {
  timeout : 1000 * 10,
  throws  : false
}

const now = () : number => Math.floor(Date.now() / 1000)

function sign (
  signer  : SignerAPI,
  message : string
) : string {
  const msg  = Buff.str(message)
  const time = Buff.num(now(), 4)
  const hash = Buff.join([ time, msg ]).digest
  const sig  = signer.sign(hash)
  const tkn  = [ signer.pubkey, sig, time ]
  if (LOG_TOKENS) {
    console.log('sign:', message, hash.hex)
    verify(Buff.join(tkn).b64url, message)
  }
  return Buff.join(tkn).b64url
}

function decode (
  token : string
) : Token {
  const bytes = Buff.b64url(token)

  if (bytes.length !== 100) {
    throw new Error(`Invalid token size: ${bytes.length}`)
  }

  return {
    pubkey : bytes.slice(0, 32),
    sig    : bytes.slice(32, 96),
    time   : bytes.slice(96)
  }
}

export function verify (
  token   : string,
  message : string,
  config  : Partial<SessionConfig> = {}
) : boolean {
  const opt = { ...DEFAULT_CONFIG, ...config }
  const msg = Buff.str(message)
  const { pubkey, sig, time } = decode(token)

  const delta = now() - time.num

  if (delta >= opt.timeout) {
    if (!opt.throws) return false
    throw new Error('Token is expired!')
  }

  const hash = Buff.join([ time, msg ]).digest

  if (LOG_TOKENS) {
    console.log('verify:', message, hash.hex)
  }
  return V(sig, hash, pubkey)
}

export function createFetch (
  signer : SignerAPI,
  config : Partial<SessionConfig> = {}
  ) : typeof fetch {
  return async (
    input : RequestInfo | URL,
    init  : RequestInit | undefined = {}
  ) : Promise<Response> => {
    const { host } = config

    let url = (input instanceof Request)
      ? input.url
      : input instanceof URL
        ? input.toString()
        : input

    if (typeof host === 'string') {
      url = host + url
    }

    if (url.includes('://')) {
      url = url.split('://')[1]
    }

    const body = (typeof init.body === 'object')
      ? JSON.stringify(init.body)
      : (typeof init.body === 'string')
        ? init.body
        : ''

    const token  = sign(signer, url + body)
    init.headers = { Authorization: 'Bearer ' + token }

    return fetch(input, init)
  }
}
