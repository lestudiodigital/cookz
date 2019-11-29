import css from 'glamor-jss'

export default {
  container: css({
    position: 'fixed',
    bottom: '0',
    left: '0',
    color: 'red',

    '&.hide': {
      display: 'none'
    }
  }),
  title: css({
    color: 'blue',
  }),
  description: css({
    color: 'yellow',
  }),
  button: css({
    color: 'purple'
  })
}