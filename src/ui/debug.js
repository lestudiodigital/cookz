import crel from 'crel'
import store from '../store'
import classNames from 'classnames'

let $fields = {}
let $debug

function createField (key, val) {
  return crel(
    'div',
    {class: classNames('debug-field', {valid: val})},
    `${key} = ${val}`
  )
}

const updateField = (key) => (val) => {
  $fields[key].innerHTML = `${key} = ${val}`
  $fields[key].classList.toggle('valid', val)
}

function create () {
  for (const key in store) {
    $fields[key] = createField(key, store[key].get())
  }

  $debug = crel(
    'div',
    {class: 'debug-component'},
    Object.values($fields),
  )

  listen()
}


function listen () {
  for (const key in store) {
    store[key].listen(updateField(key))
  }
}

function unlisten () {
  for (const key in store) {
    store[key].unlisten(updateField)
  }
}

function update () {

}

function destroy () {
  unlisten()
}

function init () {

  create()

  return {
    update,
    destroy,
    dom: $debug
  }
}

export default init