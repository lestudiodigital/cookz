import crel from 'crel'
import store from '../store'
import TYPES from '../types'
import { eraseAll, set } from '../cookie'
import classNames from 'classnames'

let translations
let cookies

let $popin
let $fields = []
let $form
let $submit

function createField (key, params = {}) {
  const field = translations[key] || {}

  const inputParams = {type: 'checkbox', name: key, id: key}
  if (params.required) inputParams.required = 'required'

  if (store[key].get()) inputParams.checked = true

  $fields.push(
    crel(
      'div',
      {class: 'field'},
      crel('input', inputParams),
      crel(
        'label',
        {class: 'label', type: 'checkbox', for: key},
        crel('span', {class: 'field-title'}, field.title),
        crel('span', {class: 'field-description'}, field.description)
      ),
    )
  )
}

function create (params) {
  for (const key in cookies) {
    let prms
    params.forEach(pr => {
      if (pr.type === key) prms = pr
    })

    createField(key, prms)
  }

  $submit = crel('button', {type: 'submit'}, translations.submit)

  $form = crel(
    'form',
    $fields,
    $submit
  )

  $popin = crel(
    'div',
    {class: classNames('popin-component', {hide: !store.popinStatus.get()})},
    $form,
  )

  listen()
}

function updateTexts (translations = {}) {
  $submit.innerHTML = translations.submit

  let index = 0
  for (const key in cookies) {
    const trls = translations[key] || {}
    const $field = $fields[index]

    $field.querySelector('.field-title').innerHTML = trls.title
    $field.querySelector('.field-description').innerHTML = trls.description

    index++
  }
}

function onSubmit (e) {
  e.preventDefault()
  const $inputs = [].slice.call(e.srcElement.querySelectorAll('input[type="checkbox"]'))

  const state = {}
  $inputs.forEach(input => {
    const key = input.getAttribute('name')
    const val = input.checked
    state[key] = val
    store[key].set(val)
    set(key, val ? '1' : '0')
  })

  if (!state[TYPES.FUNCTIONAL]) eraseAll()
  store.popinStatus.set(false)
  store.hasInteract.set(true)
}

function show () {
  $popin.classList.remove('hide')
}

function hide () {
  $popin.classList.add('hide')
}

const toggle = (bool) => bool ? show() : hide()

function listen () {
  $form.addEventListener('submit', onSubmit)
  store.popinStatus.listen(toggle)
}

function unlisten () {
  $form.removeEventListener('submit', onSubmit)
  store.popinStatus.unlisten(toggle)
}

function destroy () {
  unlisten()
}

function init (trlts, cks, params) {
  translations= trlts
  cookies = cks

  create(params)

  return {
    updateTexts,
    destroy,
    dom: $popin
  }
}

export default init