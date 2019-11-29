import Banner from './banner'
import Popin from './popin'

let banner
let popin

function update () {
  banner.update()
  popin.update()
}

function destroy () {
  banner.destroy()
  popin.destroy()
}

function init (cookies, translations) {
  banner = Banner(translations, cookies)
  popin = Popin(translations, cookies)

  return {
    update,
    destroy
  }
}

export default init