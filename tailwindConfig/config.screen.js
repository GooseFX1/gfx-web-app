const screens = {
  //WIDTH_UP_TO - @media(max-width: ${max}px)
  sm: { max: '500px' },
  md: { max: '720px' },
  lg: { max: '960px' },
  xl: { max: '1280px' },

  //WIDTH_FROM - @media(min-width: ${min-}px)
  'min-sm': '501px',
  'min-md': '721px',
  'min-lg': '961px',
  'min-xl': '1281px'
}

module.exports = { screens }
