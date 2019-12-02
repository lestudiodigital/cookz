import Cookz, {
  TYPES,
  store,
  services
} from './index'

const cookies = [
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
    type: TYPES.SOCIAL
  },
  {
    type: TYPES.ADVERTISING
  },
]

Cookz({
  logs: false,
  debug: true,
  translations: {
    banner: {
      title: '',
      description: '',
      accept: '',
      configure: '',
    },
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
    },
    [TYPES.ADVERTISING]: {
      title: 'title advert',
      description: 'description advert'
    }
  },
  cookies
})

const $buttonBanner = document.getElementById('show-banner')
const $buttonPopin = document.getElementById('show-popin')

$buttonBanner.addEventListener('click', () => {
  store.bannerStatus.set(true)
})

$buttonPopin.addEventListener('click', () => {
  store.popinStatus.set(true)
})


