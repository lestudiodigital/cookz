# Cookz 🐕

Cookz is a cookie manager, with integrated services.

You can see an online [demo][preprod]


## CONSTRUCTOR

```js
import { init, TYPES } from 'cookz'

const cookies = [
  // Auto add a functional cookie
  {
    type: TYPES.PERFORMANCE,
    service: 'GA',
    UA: 'UAXXXXXXX',
    // Add all ga properties ...
    anonymizeIp: true,
    firstPageView: true,
    forceSSL: true
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


## TYPES VALUES

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
// Set status
store.bannerStatus.set(true)
// Listen
store.bannerStatus.listen(val => console.log(val))
// Unlisten
store.bannerStatus.unlisten(val => console.log(val))
```


[preprod]: <https://lestudiodigital.github.io/cookz/>