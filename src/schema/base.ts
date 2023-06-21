import { z } from 'zod'

const string    = z.string()
const hex       = z.string().regex(/^[0-9a-fA-F]*$/).refine((e) => e.length % 2 === 0)
const hash      = hex.refine((e) => e.length === 64)
const pubkey    = hex.refine((e) => e.length === 64  || e.length === 66)
const nonce     = hex.refine((e) => e.length === 128 || e.length === 132)
const signature = hex.refine((e) => e.length === 128)
const timestamp = z.number().max(4294967295)
const literal   = z.union([ z.string(), z.number(), z.boolean(), z.null() ])
const entries   = z.array(literal.array())
const base64    = z.string().regex(/^[a-zA-Z0-9+/]+={0,2}$/)
const base64url = z.string().regex(/^[a-zA-Z0-9\-_]+={0,2}$/)

const address = z.string().url()
const socketAddress = address.startsWith('wss://')

const json : z.ZodType<Json> = z.lazy(() =>
  z.union([ literal, z.array(json), z.record(json) ])
)

const record = z.record(json)

export const BaseSchema = {
  string,
  hex,
  hash,
  literal,
  entries,
  json,
  record,
  pubkey,
  nonce,
  signature,
  timestamp,
  address,
  socketAddress,
  base64,
  base64url
}

export type Literal = z.infer<typeof literal>
export type Json    = Literal | { [key : string] : Json } | Json[]
