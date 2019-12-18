import { createStore } from './src/state'

import ga from './src/ga.js'
import store from './src/store'
import {add} from './src/cookie'
import TYPES from './src/types'
import UIManager from './src/ui/index'

import css from './src/main.scss'

const _cookies = {}
const customCookies = {}
const services = {}
let UI

const update = (name) => (val) => {
  store.logs.get() && console.log(`[store] => update ${name} to ${val}`)
  _cookies[name].set(val ? '1' : '0')
}

function listen () {
  for(const key in _cookies) {
    store[key].listen(update(key))
  }
}

function init (params) {
  const {cookies, logs, translations, debug, className} = params
  const storeValues = {}
  storeValues.logs = params.logs || false

  let isFunctional
  let isPerformance
  let isSocial
  let isAdvertising

  cookies.forEach(cookie => {
    const { name } = cookie

    isFunctional |= cookie.type === TYPES.FUNCTIONAL
    isPerformance |= cookie.type === TYPES.PERFORMANCE
    isSocial |= cookie.type === TYPES.SOCIAL
    isAdvertising |= cookie.type === TYPES.ADVERTISING

    // GA service
    if (cookie.service === 'GA' && cookie.type === TYPES.PERFORMANCE) {
      services.ga = ga(cookie)
    } else if (cookie.type === TYPES.FUNCTIONAL) {
      customCookies[name] = add(cookie.name)
    }
  })

  // Enable functionnal when there at least 1 coookie
  if (isSocial || isPerformance || isAdvertising) isFunctional = true

  // Check functional type
  if (isFunctional) {
    _cookies[TYPES.FUNCTIONAL] = add(TYPES.FUNCTIONAL)
    storeValues[TYPES.FUNCTIONAL] = _cookies[TYPES.FUNCTIONAL].get() === '1'
  }

  // Check performance type
  if (isPerformance) {
    _cookies[TYPES.PERFORMANCE] = add(TYPES.PERFORMANCE)
    storeValues[TYPES.PERFORMANCE] = _cookies[TYPES.PERFORMANCE].get() === '1'
  }

  // Check social type
  if (isSocial) {
    _cookies[TYPES.SOCIAL] = add(TYPES.SOCIAL)
    storeValues[TYPES.SOCIAL] = _cookies[TYPES.SOCIAL].get() === '1'
  }

  // Check advertising type
  if (isAdvertising) {
    _cookies[TYPES.ADVERTISING] = add(TYPES.ADVERTISING)
    storeValues[TYPES.ADVERTISING] = _cookies[TYPES.ADVERTISING].get() === '1'
  }

  // Create store from dynamic & static values
  Object.assign(store, createStore(Object.assign(store, storeValues)))

  // Show cookie is there's no functionnal cookie
  store.bannerStatus.set(!_cookies[TYPES.FUNCTIONAL].get())

  // Listen store events
  listen()

  // UI Instance
  UI = UIManager(_cookies, translations, debug, className)
}


module.exports = {
  init,
  store,
  TYPES,
  services,
  css
}