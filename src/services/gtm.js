import { add } from '../cookie'
import store from '../store'

let props

function appendScript (ID) {
  const noScript = document.createElement('noscript')
  const funcScript = document.createElement('script')

  const iframe = document.createElement('iframe')
  iframe.height = 0
  iframe.width = 0
  iframe.style.display ="none"
  iframe.style.visibility = "hidden"
  iframe.src = `https://www.googletagmanager.com/ns.html?id=${ID}`
  noScript.appendChild(iframe)

  funcScript.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${ID}');
  `

  const body = document.getElementsByTagName('body')[0]
  body.appendChild(funcScript)
  body.appendChild(noScript)
}

function start (props) {
  const {ID} = props
}

function trigger (func) {
  store.performance.get() === true && func(window.dataLayer)
}

function init (p) {
  props = p
  const {name, logs} = props
  logs && console.log(`[GTM] => INIT`, props)

  appendScript(props.ID)

  return {
    trigger
  }
}

export default init