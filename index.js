import ga from './src/ga.js'
import functional from './src/functional.js'
import custom from './src/custom.js'
import createStore from './src/store'

const TYPES = {
  GA: 0,
  FUNCTIONAL: 1,
  CUSTOM: 2
}

const plugins = {}
const storeValues = {}
let store

function init (params) {
  params.forEach(plugin => {
    if (plugin.type === TYPES.GA) {
      storeValues.performance = false
      plugins.ga = ga(plugin)
    } else if (plugin.type === TYPES.FUNCTIONAL) {
      storeValues.functional = false
      plugins.func = functional(plugin)
    } else if (plugin.type === TYPES.CUSTOM) {
      storeValues[plugin.name] = false
      plugins[plugin.name] = custom(plugin)
    }
  })

  store = createStore(storeValues)

  return {
    plugins,
    store: store
  }
}

export {
  init,
  store,
  TYPES,
}