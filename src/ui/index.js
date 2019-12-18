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

function update () {
  banner.update()
  popin.update()
  debug && debug.update()
}

function destroy () {
  banner.destroy()
  popin.destroy()
  debug && debug.destroy()
}

export default function init (cookies, translations, dbg, className = '') {
  banner = Banner(translations, cookies)
  popin = Popin(translations, cookies)
  if (dbg) debug = Debug()

  console.log(className)
  const $cookz = crel(
    'div',
    {class: classNames('cookz-component', className)},
    banner.dom,
    popin.dom,
    debug.dom
  )

  body.appendChild($cookz)

  return {
    update,
    destroy,
    dom: $cookz
  }
}