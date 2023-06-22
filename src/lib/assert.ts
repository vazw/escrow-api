import { BaseSchema } from '../schema/model/base.js'

export function assert_hash (hash : string) : void {
  const schema = BaseSchema.hash
  schema.parse(hash)
}
