import { createStore } from './src/state'

import ga from './src/services/ga.js'
import gtm from './src/services/gtm.js'
import fbq from './src/services/fbq.js'
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

function updateTexts (translations) {
  UI.updateTexts(translations)
}

function init (params) {
  const {cookies, logs, translations = {}, debug, className, callbacks = {}} = params
  const storeValues = {}
  storeValues.logs = params.logs || false

  let isFunctional
  let isPerformance
  let isSocial
  let isAdvertising

  cookies.forEach(cookie => {
    const { type } = cookie

    isFunctional |= type === TYPES.FUNCTIONAL
    isPerformance |= type === TYPES.PERFORMANCE
    isSocial |= type === TYPES.SOCIAL
    isAdvertising |= type === TYPES.ADVERTISING
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
  if (!_cookies[TYPES.FUNCTIONAL].get()) {
    store.bannerStatus.set(true)
    store.hasInteract.set(false)
  }

  cookies.forEach(cookie => {
    const { name } = cookie

    // GA service
    if (cookie.service === 'GA' && cookie.type === TYPES.PERFORMANCE) {
      services.ga = ga(cookie)
    } else if (cookie.service === 'GTM' && cookie.type === TYPES.PERFORMANCE) {
      services.gtm = gtm(cookie)
    } else if (cookie.service === 'FBQ' && cookie.type === TYPES.ADVERTISING) { // FBQ Service
      services.fbq = fbq(cookie)
    } else if (cookie.type === TYPES.FUNCTIONAL) { // Custom functional
      customCookies[name] = add(cookie.name)
      services[name] = customCookies[name]
    }
  })

  // Listen store events
  listen()

  // UI Instance
  UI = UIManager(_cookies, translations, cookies, debug, className, callbacks)
}


module.exports = {
  init,
  store,
  TYPES,
  services,
  updateTexts
}