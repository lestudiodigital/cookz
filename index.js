import { createStore } from './src/state'

import ga from './src/ga.js'
import store from './src/store'
import {CookieAbstraction, cookies} from './src/cookie'
import TYPES from './src/types'
import UIManager from './src/ui/index'

const _cookies = {}
const services = {}
const customCookies = {}
let UI

const update = (name) => (val) => {
  console.log('UPDATE COOKIE', name, val, _cookies)
  _cookies[name].set(val ? '1' : '0')
}

const erase = () => {
  _cookies.forEach(cookie => cookie.erase())
}

function listen () {
  for(const key in _cookies) {
    store[key].listen(update(key))
  }
}

function init (params) {
  const {plugins, logs, translations} = params
  const storeValues = {}
  storeValues.logs = params.logs || false

  let isFunctional
  let isPerformance
  let isSocial

  plugins.forEach(plugin => {
    const { name } = plugin
    plugin.logs = logs

    isFunctional |= plugin.type === TYPES.FUNCTIONAL
    isPerformance |= plugin.type === TYPES.PERFORMANCE
    isSocial |= plugin.type === TYPES.SOCIAL


    if (plugin.service === 'GA' && plugin.type === TYPES.PERFORMANCE) {
      services.ga = ga(plugin)
    } else {
      customCookies[name] = new CookieAbstraction(plugin.name)
    }
  })

  // Enable functionnal when there at least 1 coookie
  if (isSocial || isPerformance) isFunctional = true

  if (isFunctional) {
    _cookies[TYPES.FUNCTIONAL] = new CookieAbstraction(TYPES.FUNCTIONAL)
    storeValues[TYPES.FUNCTIONAL] = _cookies[TYPES.FUNCTIONAL].get() === '1'
  }

  if (isPerformance) {
    _cookies[TYPES.PERFORMANCE] = new CookieAbstraction(TYPES.PERFORMANCE)
    storeValues[TYPES.PERFORMANCE] = _cookies[TYPES.PERFORMANCE].get() === '1'
  }

  if (isSocial) {
    _cookies[TYPES.SOCIAL] = new CookieAbstraction(TYPES.SOCIAL)
    storeValues[TYPES.SOCIAL] = _cookies[TYPES.SOCIAL].get() === '1'
  }

  // Create store from dynamic & static values
  Object.assign(store, createStore(Object.assign(store, storeValues)))
  Object.assign(cookies, Object.assign(customCookies, _cookies))

  console.log(cookies)
  // Show cookie is there's no functionnal cookie
  store.bannerStatus.set(!store[TYPES.FUNCTIONAL].get())

  // Listen store events
  listen()
  // UI Instance
  UI = UIManager(_cookies, translations)
  // return cookies
}

export {
  init,
  store,
  TYPES
  // plugs
}