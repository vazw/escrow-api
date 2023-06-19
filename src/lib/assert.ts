import { BaseSchema } from '../schema/base.js'

export function assert_hash (hash : string) : void {
  const schema = BaseSchema.hash
  schema.parse(hash)
}
