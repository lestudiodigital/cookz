import {
  init,
  TYPES,
  store,
  services,
  updateTexts
} from './index'

const cookies = [
  // {
  //   type: TYPES.PERFORMANCE,
  //   service: 'GA',
  //   UA: 'UA-150555555-1',
  //   anonymizeIp: true,
  // },
  // {
  //   type: TYPES.FUNCTIONAL,
  //   name: 'experience',
  //   required: true
  // },
  // {
  //   type: TYPES.SOCIAL
  // },
  // {
  //   type: TYPES.PERFORMANCE,
  //   service: 'GTM',
  //   ID: 'GTM0000'
  // },
  {
    type: TYPES.ADVERTISING,
    service: 'FBQ',
    ID: '208499613540246'
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
  submit: 'Submit',
}

init({
  logs: true,
  debug: true,
  className: 'test-cookies',
  cookies,
  callbacks: {
    onAccept: () => { console.log('onAccept') },
    onConfigure: () => { console.log('onConfigure') }
  }
})

updateTexts(translations)

setTimeout(() => {
  // Use services
  services.gtm.trigger(dataLayer => {
    // dataLayer.push({})
  })

  // services.fbq.trigger(fbq => {
    // fbq('track', 'PageView')
  // })

  // services.ga.trigger(ga => {
    // ga.send({})
  // })
}, 3000)

const $buttonBanner = document.getElementById('show-banner')
const $buttonPopin = document.getElementById('show-popin')

$buttonBanner.addEventListener('click', () => {
  store.bannerStatus.set(true)
})

$buttonPopin.addEventListener('click', () => {
  store.popinStatus.set(true)
})


