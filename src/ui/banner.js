import crel from 'crel'
import classNames from 'classnames'
import store from '../store'

let $banner
let $accept
let $configure
let cookies
let translations

function create () {
  $accept = crel('button', {class: 'banner-button'}, 'Accept all'),
  $configure = crel('button', {class: 'banner-button'}, 'Configure')

  $banner = crel(
    'div',
    {class: classNames('banner-component', {hide: !store.bannerStatus.get()})},
    crel(
      'div',
      {class: 'banner-content'},
      crel('div', {class: 'banner-title'}, 'Title banner'),
      crel('div', {class: 'banner-description'}, 'Description banner'),
      crel('div', {class: 'banner-ctas'}, $accept, $configure)
    )
  )

  listen()
}

function update () {
  $configure.innerHTML = 'test'
}

function destroy () {
  translations = null
  cookies = null
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

function init (trlts, cks) {
  translations= trlts
  cookies = cks
  create()

  return {
    update,
    destroy,
    dom: $banner
  }
}

export default init