import crel from 'crel'
import classNames from 'classnames'
import store from '../store'

let $banner
let $accept
let $configure
let $title
let $description
let cookies
let translations

function create () {
  let banner = translations.banner || {}
  $title = crel('div', {class: 'banner-title'}, banner.title)
  $description = crel('div', {class: 'banner-description'}, banner.description)
  $accept = crel('button', {class: 'banner-button'}, banner.accept)
  $configure = crel('button', {class: 'banner-button'}, banner.configure)

  $banner = crel(
    'div',
    {class: classNames('banner-component', {hide: !store.bannerStatus.get()})},
    crel(
      'div',
      {class: 'banner-content'},
      $title,
      $description,
      crel('div', {class: 'banner-ctas'}, $accept, $configure)
    )
  )

  listen()
}

function updateTexts (translations) {
  const banner = translations.banner || {}

  $title.innerHTML = banner.title
  $description.innerHTML = banner.description
  $accept.innerHTML = banner.accept
  $configure.innerHTML = banner.configure
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
  store.hasInteract.set(true)

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
    updateTexts,
    destroy,
    dom: $banner
  }
}

export default init