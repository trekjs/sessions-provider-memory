/*!
 * sessions-provider-memory
 * Copyright(c) 2017 Fangdun Cai <cfddream@gmail.com> (https://fundon.me)
 * MIT Licensed
 */

'use strict'

const TIMER = Symbol('timer')

module.exports = class MemoryProvider extends Map {
  get(sid) {
    const sess = super.get(sid)
    if (!sess) return

    const expires = sess.cookie.expires
    if (expires && expires <= Date.now()) {
      this.delete(sid)
      return
    }

    return sess
  }

  set(sid, sess, expires) {
    super.set(sid, sess)
    // Should clear old timer
    if (sess[TIMER]) {
      sess.cookie.expires = new Date() + expires
      clearTimeout(sess[TIMER])
    }

    Object.defineProperty(sess, TIMER, {
      configurable: true,
      enumerable: false,
      writable: true,
      value: setTimeout(() => this.delete(sid), expires).unref()
    })
  }

  quit() {}
}
