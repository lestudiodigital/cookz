import crel from 'crel'
import classNames from 'classnames'
import store from '../store'

let $banner
let $accept
let $refuse
let $configure
let $title
let $description
let cookies
let translations
let callbacks

function create (refuse) {
  let banner = translations.banner || {}
  $title = crel('div', {class: 'banner-title'}, banner.title)
  $description = crel('div', {class: 'banner-description'}, banner.description)
  $accept = crel('button', {class: 'banner-button'}, banner.accept)
  $configure = crel('button', {class: 'banner-button'}, banner.configure)
  if (refuse) $refuse = crel('button', {class: 'banner-button'}, banner.refuse)

  $banner = crel(
    'div',
    {class: classNames('banner-component', {hide: !store.bannerStatus.get()})},
    crel(
      'div',
      {class: 'banner-content'},
      $title,
      $description,
      crel('div', {class: 'banner-ctas'}, $accept, $configure, refuse ? $refuse : null)
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
  if ($refuse) $refuse.innerHTML = banner.refuse
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

  callbacks.onAccept && callbacks.onAccept()
}

function onConfigure () {
  store.bannerStatus.set(false)
  store.popinStatus.set(true)
  callbacks.onConfigure && callbacks.onConfigure()
}

function onRefuse () {
  store.bannerStatus.set(false)
  store.hasInteract.set(true)

  for (const key in cookies) {
    console.log(key)
    store[key].set(key === 'functional' ? true : false)
  }

  callbacks.onRefuse && callbacks.onRefuse()
}

const toggle = bool => bool ? show() : hide()

function listen () {
  store.bannerStatus.listen(toggle)
  $accept.addEventListener('click', onAccept)
  $configure.addEventListener('click', onConfigure)
  if ($refuse) $refuse.addEventListener('click', onRefuse)
}

function unlisten () {
  store.bannerStatus.unlisten(toggle)
  $accept.removeEventListener('click', onAccept)
  $configure.removeEventListener('click', onConfigure)
  if ($refuse) $refuse.removeEventListener('click', onRefuse)
}

function init (trlts, cks, params, cbs, refuse) {
  callbacks = cbs
  translations= trlts
  cookies = cks
  create(refuse)
  
  return {
    updateTexts,
    destroy,
    dom: $banner
  }
}

export default init