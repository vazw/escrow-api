import { NostrClient, TopicEmitter } from '@cmdcode/nostr-utils'

export class ContractClient {
  public client : NostrClient
  public topic  : TopicEmitter

  constructor (
    privkey : string,
    topic   : string
  ) {
    this.client = new NostrClient({ privkey })
    this.topic  = this.client.topic(topic)
  }

  get active () : boolean {
    return this.topic.sub.subscribed
  }
}
