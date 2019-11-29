let browserCookie
if (typeof window !== 'undefined') browserCookie = require('browser-cookies')

class CookieAbstraction {
  constructor (key) {
    this.key = key
  }

  get () {
    return browserCookie ? browserCookie.get(this.key) : false
  }

  set (val, opts = {expires: 365}) {
    browserCookie && browserCookie.set(this.key, val, opts)
  }

  erase () {
    browserCookie && browserCookie.erase(this.key)
  }
}

let cookies = {}

export {
  CookieAbstraction,
  cookies
}