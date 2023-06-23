import { z } from 'zod'

export type Literal = z.infer<typeof literal>
export type Json    = Literal | { [key : string] : Json } | Json[]

const address    = z.string(),
      date       = z.date(),
      script     = z.string().array(),
      timestamp  = z.number().max(4294967295),
      value      = z.bigint().min(512n)

const hex = z
  .string()
  .regex(/^[0-9a-fA-F]*$/)
  .refine(e => e.length % 2 === 0)

const hash      = hex.refine((e) => e.length === 64)
const pubkey    = hex.refine((e) => e.length === 64  || e.length === 66)
const nonce     = hex.refine((e) => e.length === 128 || e.length === 132)
const signature = hex.refine((e) => e.length === 128)

const base64    = z.string().regex(/^[a-zA-Z0-9+/]+={0,2}$/)
const base64url = z.string().regex(/^[a-zA-Z0-9\-_]+={0,2}$/)
const bech32    = z.string() // .regex(/^[a-zA-Z0-9\-_]+={0,2}$/)

const literal = z.union([
  z.string(), z.number(), z.boolean(), z.null()
])

const json : z.ZodType<Json> = z.lazy(() =>
  z.union([ literal, z.array(json), z.record(json) ])
)

const entry  = z.tuple([ z.string(), literal ])
const record = z.record(literal.array())
const tags   = literal.array()

export const BaseSchema = {
  address,
  base64,
  base64url,
  bech32,
  date,
  entry,
  hash,
  hex,
  literal,
  json,
  nonce,
  pubkey,
  script,
  signature,
  record,
  tags,
  timestamp,
  value
}