import crel from 'crel'
import classNames from 'classnames'
import store from '../store'

let $banner
let $accept
let $configure
let cookies
let translations

function create () {
  const {banner} = translations
  $accept = crel('button', {class: 'banner-button'}, banner.accept),
  $configure = crel('button', {class: 'banner-button'}, banner.configure)

  $banner = crel(
    'div',
    {class: classNames('banner-component', {hide: !store.bannerStatus.get()})},
    crel(
      'div',
      {class: 'banner-content'},
      crel('div', {class: 'banner-title'}, banner.title),
      crel('div', {class: 'banner-description'}, banner.description),
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