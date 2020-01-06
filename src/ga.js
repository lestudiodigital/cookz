import { add } from './cookie'
import store from './store'

function getExpirationDate (ga) {
  const secExpire = 60 * 60 * 24 * 30 * 13 * 1000
  try {
    const gaCreate = (Number(ga.split('.').pop())) * 1000
    const t = new Date().getTime()
    const t0 = new Date(gaCreate).getTime()
    const t1 = t0 + secExpire
    const tDiff = Math.round((t1 - t) / 1000)
    return tDiff
  } catch (e) {
    return secExpire / 1000
  }
}

function appendScript (UA) {
  const libScript = document.createElement('script')
  const funcScript = document.createElement('script')

  libScript.setAttribute('async', 'true')
  libScript.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${UA}`)

  funcScript.setAttribute('type', 'text/javascript')
  funcScript.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag () { dataLayer.push(arguments) };
    window.gtag = gtag;
  `

  const body = document.getElementsByTagName('body')[0]
  body.appendChild(libScript)
  body.appendChild(funcScript)
}

function start (props, cookie) {
  const {UA, anonymizeIp = true, forceSSL = true, firstPageView = false} = props
  window.gtag('js', new Date());

  const params = {
    'cookie_expires': getExpirationDate(cookie),
    'anonymize_ip': anonymizeIp,
    'forceSSL': forceSSL,
    'send_page_view': firstPageView
  }

  window.gtag('config', `${UA}`, params)
}

function trigger (func) {
  store.functional.get() === true && func(window.gtag)
}

function init (props) {
  const {name, logs} = props
  logs && console.log(`[_ga] => INIT`, props)

  appendScript(props.UA)
  const cookie = add('_ga')
  start(props, cookie.get())

  return {
    cookie,
    trigger
  }
}

export default init