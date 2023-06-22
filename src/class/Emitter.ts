/**
 *  ## EventEmitter
 *
 *  Type-safe implementation of a
 *  standard event emitter object.
 *
 * */

type EventKey <S extends EventMap> = string & keyof S
type EventMap   = Record<string, any>
type EventSet   = Set <Function>
type EventStore = Map <keyof EventMap, EventSet>

export class EventEmitter<S extends EventMap = unknown[]> {
  readonly _events : EventStore

  constructor () { this._events = new Map() }

  _getHandlers (eventName : string) : EventSet {
    /** If key undefined, create a new set for the event,
     *  else return the stored subscriber list.
     * */
    let events = this._events.get(eventName)
    if (events === undefined) {
      events = new Set()
      this._events.set(eventName, events)
    }
    return events
  }

  public has (topic : string) : boolean {
    const res = this._events.get(topic)
    return (res instanceof Set && res.size > 0)
  }

  public on <K extends EventKey <S>> (
    eventName : K, fn : (...args : S[K]) => void | Promise<void>
  ) : void {
    /** Subscribe function to run on a given event. */
    this._getHandlers(eventName).add(fn)
  }

  public once <K extends EventKey <S>> (
    eventName : K, fn : (...args : S[K]) => void | Promise<void>
  ) : void {
    /** Subscribe function to run once, using
     *  a callback to cancel the subscription.
     * */

    const onceFn = (...args : S[K]) : void => {
      this.removeHandler(eventName, onceFn)
      void fn.apply(this, args)
    }

    this.on(eventName, onceFn)
  }

  public within <K extends EventKey <S>> (
    eventName : K,
    fn        : (...args : S[K]) => void | Promise<void>,
    timeout   : number
  ) : void {
    /** Subscribe function to run within a given,
     *  amount of time, then cancel the subscription.
     * */
    const withinFn = (...args : S[K]) : void => {
      void fn.apply(this, args)
    }
    setTimeout(() => { this.removeHandler(eventName, withinFn) }, timeout)

    this.on(eventName, withinFn)
  }

  public emit <K extends EventKey <S>> (
    eventName : string, ...args : S[K]
  ) : void {
    /** Emit a series of arguments for the event, and
     *  present them to each subscriber in the list.
     * */
    const methods : Function[] = []
    this._getHandlers(eventName).forEach((fn : Function) => {
      methods.push(fn.apply(this, args))
    })

    this._getHandlers('*').forEach((fn : Function) => {
      methods.push(fn.apply(this, [ eventName, ...args ]))
    })

    void Promise.allSettled(methods)
  }

  public removeHandler <K extends EventKey <S>> (
    eventName : K,
    fn : (...args : S[K]) => void
  ) : void {
    /** Remove function from an event's subscribtion list. */
    this._getHandlers(eventName).delete(fn)
  }

  public clearEvent (eventName : string) : void {
    this._events.delete(eventName)
  }
}
