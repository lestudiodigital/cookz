import { add } from '../cookie'
import store from '../store'

let props

function appendScript (ID) {
  const noScript = document.createElement('noscript')
  const funcScript = document.createElement('script')

  const img = document.createElement('img')
  img.height = 1
  img.width = 1
  img.src = `https://www.facebook.com/tr?id=${ID}&ev=PageView&noscript=1`
  noScript.appendChild(img)

  funcScript.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
  `

  const body = document.getElementsByTagName('body')[0]
  body.appendChild(funcScript)
  body.appendChild(noScript)
}

function start (props) {
  const {ID} = props

  window.fbq('init', ID);
  window.fbq('track', 'PageView');
}

function trigger (func) {
  store.advertising.get() === true && func(window.fbq)
}

function listen (val) {
  start(props)
}

function init (p) {
  props = p
  const {name, logs} = props
  logs && console.log(`[FBQ] => INIT`, props)

  appendScript(props.ID)
  console.log(store)
  store.advertising.listen(listen)

  return {
    trigger
  }
}

export default init