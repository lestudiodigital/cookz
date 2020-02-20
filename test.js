import {
  init,
  TYPES,
  store,
  services,
  updateTexts
} from './index'

// console.log(css)

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
    title: 'Banner <br/><br/>title',
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
  cookies
})

setTimeout(() => {
  updateTexts(translations)
}, 1000)

const $buttonBanner = document.getElementById('show-banner')
const $buttonPopin = document.getElementById('show-popin')

services.experience(cookie => console.log(cookie))

$buttonBanner.addEventListener('click', () => {
  store.bannerStatus.set(true)
})

$buttonPopin.addEventListener('click', () => {
  store.popinStatus.set(true)
})


