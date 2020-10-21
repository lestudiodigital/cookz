import Banner from './banner'
import Popin from './popin'
import Debug from './debug'
import store from '../store'
import crel from 'crel'
import classNames from 'classnames'

let banner
let popin
let debug

const body = document.getElementsByTagName('body')[0]

function updateTexts (translations) {
  banner.updateTexts(translations)
  popin.updateTexts(translations)
}

function destroy () {
  banner.destroy()
  popin.destroy()
  debug && debug.destroy()
}

export default function init (cookies, translations, params, dbg, className = '', callbacks, refuse) {
  banner = Banner(translations, cookies, params, callbacks, refuse)
  popin = Popin(translations, cookies, params, callbacks)
  if (dbg) debug = Debug()

  const $cookz = crel(
    'div',
    {class: classNames('cookz-component', className)},
    banner.dom,
    popin.dom,
    dbg ? debug.dom : null
  )

  body.appendChild($cookz)

  return {
    updateTexts,
    destroy,
    dom: $cookz
  }
}