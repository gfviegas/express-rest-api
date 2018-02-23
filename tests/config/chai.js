const chai = require('chai')

module.exports = () => {
  chai.use(require('dirty-chai'))
  chai.use(require('chai-shallow-deep-equal'))

  chai.config.includeStack = true
}
