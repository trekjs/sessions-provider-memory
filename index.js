/*!
 * sessions-provider-memory
 * Copyright(c) 2017 Fangdun Cai <cfddream@gmail.com> (https://fundon.me)
 * MIT Licensed
 */

'use strict'

module.exports = class MemoryProvider extends Map {

  get (sid) {
    const sess = super.get(sid)
    if (!sess) return

    const expires = sess.cookie.expires
    if (expires && expires <= Date.now()) {
      this.delete(sid)
      return
    }

    return sess
  }

  set (sid, sess, expires) {
    super.set(sid, sess)
    // Should clear old timer
    if (sess.__timer__) {
      sess.cookie.expires = new Date() + expires
      clearTimeout(sess.__timer__)
    }

    const timer = setTimeout(() => this.delete(sid), expires)
    timer.unref()

    Object.defineProperty(sess, '__timer__', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: timer
    })
  }

  quit () {}

}
