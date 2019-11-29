import {init, TYPES, store} from './index'

const plugins = [
  {
    type: TYPES.PERFORMANCE,
    service: 'GA',
    UA: 'UA-150555555-1',
    anonymizeIp: true,
  },
  {
    type: TYPES.FUNCTIONAL,
    name: 'experience'
  },
  {
    type: TYPES.SOCIAL,
    name: 'social'
  },
]

const cookies = init({
  logs: true,
  translations: {
    [TYPES.FUNCTIONAL]: {
      title: 'title func',
      description: 'description func'
    },
    [TYPES.PERFORMANCE]: {
      title: 'title perf',
      description: 'description perf'
    },
    [TYPES.SOCIAL]: {
      title: 'title social',
      description: 'description social'
    }
  },
  plugins
})


// cookies.ga.trigger((gtag) => { gtag.sendPageView() })
// store.functional.listen(val => console.log(val))
