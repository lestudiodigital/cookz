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


function createField (key) {
  const field = translations[key]
  if (!field || !field.title || !field.description) {
    console.warn(`Missing title or description for type ${key}`)
    return
  }

  const inputParams = {type: 'checkbox', name: key, id: key}
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

function create () {
  for (const key in cookies) {
    createField(key)
  }

  $form = crel(
    'form',
    $fields,
    crel('button', {type: 'submit'}, 'submit')
  )

  $popin = crel(
    'div',
    {class: classNames('popin-component', {hide: !store.popinStatus.get()})},
    $form,
  )

  listen()
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

function update () {

}

function destroy () {
  unlisten()
}

function init (trlts, cks) {
  translations= trlts
  cookies = cks

  create()

  return {
    update,
    destroy,
    dom: $popin
  }
}

export default init