/* eslint-disable @typescript-eslint/no-var-requires */
const animations = require('./config.animation')
const dimensions = require('./config.dimensions')
const borders = require('./config.borders')
const typography = require('./config.typography')
const screens = require('./config.screen')
const colors = require('./config.colors')
const responsive = require('./config.responsive')
module.exports = {
  ...screens,
  ...colors,
  ...animations,
  ...dimensions,
  ...borders,
  ...typography,
  ...responsive
}
