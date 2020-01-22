import {
  init,
  TYPES,
  store,
  services,
  updateTexts,
  css
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
    name: 'experience',
    required: true
  },
  {
    type: TYPES.SOCIAL
  },
  {
    type: TYPES.ADVERTISING
  },
]

const translations = {
  banner: {
    title: 'Banner title',
    description: 'Banner desc',
    accept: 'Accept',
    configure: 'Configure',
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
  },
  submit: 'Submit'
}

init({
  logs: false,
  debug: true,
  className: 'test-cookies',
  translations,
  cookies
})

const t2 = {
  banner: {
    title: 'Title updated',
    description: 'Description updated',
    accept: 'Accept updated',
    configure: 'Configure updated',
  },
  [TYPES.FUNCTIONAL]: {
    title: 'title func updated',
    description: 'description func updated'
  },
  [TYPES.PERFORMANCE]: {
    title: 'title perf updated',
    description: 'description perf updated'
  },
  [TYPES.SOCIAL]: {
    title: 'title social updated',
    description: 'description social updated'
  },
  [TYPES.ADVERTISING]: {
    title: 'title advert updated',
    description: 'description advert updated'
  },
  submit: 'Submit updated'
}

setTimeout(() => {
  updateTexts(t2)
}, 2000)

const $buttonBanner = document.getElementById('show-banner')
const $buttonPopin = document.getElementById('show-popin')

$buttonBanner.addEventListener('click', () => {
  store.bannerStatus.set(true)
})

$buttonPopin.addEventListener('click', () => {
  store.popinStatus.set(true)
})


