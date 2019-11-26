import {init, TYPES, store} from './index'

const params = [
  {
    type: TYPES.FUNCTIONAL,
  },
  {
    type: TYPES.GA,
    UA: 'IZDJID-ZA',
    anonymizeIp: true
  },
  {
    type: TYPES.CUSTOM,
    name: 'test'
  }
]

init(params)

store.functional.listen(val => console.log(val))