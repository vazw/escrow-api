import { SignerAPI } from './types'

export type EscrowConfig = Partial<EscrowOptions>

export interface EscrowOptions {
  cache_exp : number
  fetcher  ?: (signer : SignerAPI) => typeof fetch
  host      : string
}

const DEFAULT_CONFIG = {
  cache_exp : 30,
  host      : 'http://localhost:3000'
}

export function apply_defaults (
  config : EscrowConfig = {}
) : EscrowOptions {
  return { ...DEFAULT_CONFIG, ...config }
}
