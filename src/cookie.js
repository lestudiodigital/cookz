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

function add (key) {
  if (cookies[key]) {
    console.warn('Cookie already exist')
    return
  }

  return cookies[key] = new CookieAbstraction(key)
}

function get(key) {
  if (!cookies[key]) console.warn(`${key} does not exist`)
  else return cookies[key]
}

function set(key, val) {
  if (!cookies[key]) console.warn(`${key} does not exist`)
  else cookies[key].set(val)
}

function eraseAll() {
  for (const key in cookies) {
    cookies[key].erase()
  }
}

export {
  cookies,
  add,
  get,
  set,
  eraseAll
}