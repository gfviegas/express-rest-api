const moment = require('moment-timezone')
require('moment/locale/pt-br')

moment.locale('pt-br')
moment.updateLocale('pt-br', {
  dow: 1,
  doy: 7,
  weekdaysShort: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']
})
moment.locale('pt-br')

moment.tz.setDefault('America/Sao_Paulo')
const tzMoment = function (d) {
  return moment(d).tz('America/Sao_Paulo')
}

module.exports = tzMoment
