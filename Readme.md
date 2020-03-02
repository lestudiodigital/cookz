# Cookz 🐕

Cookz is a cookie manager, with integrated services.

You can see an online [demo][preprod]


## CONSTRUCTOR

```js
import { init, TYPES } from 'cookz'

const cookies = [
  // Performance service auto add a functional cookie
  {
    type: TYPES.PERFORMANCE,
    service: 'GA',
    UA: 'UAXXXXXXX',
    // Add all ga properties ...
    anonymizeIp: true,
    firstPageView: true,
    forceSSL: true
  },
  // GTM
  {
    type: TYPES.PERFORMANCE,
    service: 'GTM',
    ID: 'GTM0000'
  },
  // FBQ Pixel Facebook
  {
    type: TYPES.ADVERTISING,
    service: 'FBQ',
    ID: '208499613540246'
  },
  // Custom functional cookie
  {
    type: TYPES.FUNCTIONAL,
    name: 'experience',
    // Can add required cookie
    required: true
  }
]

init({
  // Enable logs
  logs: false,
  // Debug panel
  debug: true,
  // Custom class css
  className: 'instance-cookies',
  // All cookies instances
  cookies
})

```


## SERVICES
```js
import { services } from 'cookz'

const UA = 'UAXXXXXX'


// Use services
services.gtm.trigger(dataLayer => {
  dataLayer.push({})
})

services.fbq.trigger(fbq => {
  fbq('track', 'PageView')
})

services.ga.trigger(ga => {
  ga('config', UA, {
    'page_title': title,
    'page_path': path
  })
})
```

## STORE VALUES

```js
import { store } from 'cookz'
```

- popinStatus : Is popin visible
- bannerStatus : Is banner visible
- hasInteract : Has user interact with cookz
- functional : Functional cookie
- performance : Performance cookie
- social : Social cookie
- advertising : Advertising cookie


## COOKIES TYPES VALUES

```js
import { TYPES } from 'cookz'
```

- TYPES.FUNCTIONAL
- TYPES.PERFORMANCE
- TYPES.SOCIAL
- TYPES.ADVERTISING

## LOCALISATION

```js
import { updateTexts, TYPES } from 'cookz'

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

updateTexts(translations)
```

## SAMPLES

```js
// Same for all store values

// Get value
store.bannerStatus.get()
// Set value
store.bannerStatus.set(true)
// Listener function
function listen (val) { console.log(val) }
// Listen
store.bannerStatus.listen(listen)
// Unlisten
store.bannerStatus.unlisten(listen)
```


[preprod]: <https://lestudiodigital.github.io/cookz/>