import css from 'glamor-jss'

export default {
  container: css({
    zIndex: 10,
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(0, 0, 0, 0.3)',

    '&.hide' : {
      display: 'none'
    }
  }),
  form: css({
    padding: '10px'
  }),
  field: css({
    color: 'blue',
    display: 'flex',
    flexDirection: 'row',
  }),
  label: css({
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer'
  }),
  fieldTitle: css({
    color: 'blue'
  }),
  fieldDescription: css({
    color: 'blue'
  })
}
