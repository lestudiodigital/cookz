import crel from 'crel'
import css from './popin.css'
import store from '../store'
import TYPES from '../types'

const body = document.getElementsByTagName('body')[0]
let translations
let cookies

let $popin
let $fields = []
let $form


function createField (key) {
  const {title, description} = translations[key]
  return crel(
    'div',
    {class: css.field},
    crel('input', {type: 'checkbox', name: key, id: key}),
    crel(
      'label',
      {class: css.label, type: 'checkbox', for: key},
      crel('span', {class: css.fieldTitle}, title),
      crel('span', {class: css.fieldDescription}, description)
    ),
  )
}

function create () {
  for (const key in cookies) {
    $fields.push(
      createField(key)
    )
  }

  $form = crel(
    'form',
    {class: css.form},
    $fields,
    crel('input', {type: 'submit'}, 'submit')
  )

  $popin = crel(
    'div',
    {class: [css.container, !store.popinStatus.get() ? 'hide': ''].join(' ')},
    $form,
  )

  body.appendChild($popin)
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
    destroy
  }
}

export default init