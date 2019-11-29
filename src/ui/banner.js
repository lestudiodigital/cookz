import crel from 'crel'
import store from '../store'

import css from './banner.css'

const body = document.getElementsByTagName('body')[0]

let $banner
let $accept
let $configure
let cookies

function create () {
  $accept = crel('button', {class: css.button}, 'Accept all'),
  $configure = crel('button', {class: css.button}, 'Configure')

  $banner = crel(
    'div',
    {class: [css.container, !store.bannerStatus.get() ? 'hide' : ''].join(' ')},
    crel('div', {class: css.title}, 'Title banner'),
    crel('div', {class: css.description}, 'Description banner'),
    $accept,
    $configure
  )

  body.appendChild($banner)
  listen()
}

function update () {
  $configure.innerHTML = 'test'
}

function destroy () {
  unlisten()
}

function show() {
  $banner.classList.remove('hide')
}

function hide () {
  $banner.classList.add('hide')
}

function onAccept () {
  store.bannerStatus.set(false)

  for (const key in cookies) {
    store[key].set(true)
  }
}

function onConfigure () {
  store.bannerStatus.set(false)
  store.popinStatus.set(true)
}

const toggle = bool => bool ? show() : hide()

function listen () {
  store.bannerStatus.listen(toggle)
  $accept.addEventListener('click', onAccept)
  $configure.addEventListener('click', onConfigure)
}

function unlisten () {
  store.bannerStatus.unlisten(toggle)
  $accept.removeEventListener('click', onAccept)
  $configure.removeEventListener('click', onConfigure)
}

function init (translations, cks) {
  cookies = cks
  create()

  return {
    update,
    destroy
  }
}

export default init