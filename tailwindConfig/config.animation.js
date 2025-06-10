const { twConfigAnimations } = require('gfx-component-lib')

const keyframes = {
  slideInBottom: {
    '0%': {
      transform: 'translateY(1000px)',
      animationTimingFunction: 'ease-out'
    },
    '60%': {
      transform: 'translateY(-30px)',
      animationTimingFunction: 'ease-in'
    },
    '80%': {
      transform: 'translateY(10px)',
      animationTimingFunction: 'ease-out'
    },
    '100%': {
      transform: 'translateY(0px)',
      animationTimingFunction: 'ease-in'
    }
  },
  slideInTop: {
    '0%': {
      transform: 'translateY(-1000px)',
      opacity: 0,
      animationTimingFunction: 'ease-out'
    },
    '60%': {
      transform: 'translateY(30px)',
      animationTimingFunction: 'ease-in'
    },
    '80%': {
      transform: 'translateY(-10px)',
      animationTimingFunction: 'ease-out'
    },
    '100%': {
      transform: 'translateY(0px)',
      animationTimingFunction: 'ease-in',
      opacity: 1
    }
  },
  lightTextPulse: {
    "0%, 100%" :{
      color: `#AEA0B9`
    },
    "50%": {
      color: `#636363`
    }
  },
  darkTextPulse: {
    "0%, 100%" :{
      color: `#B5B5B5`
    },
    "50%": {
      color: `#636363`
    }
  },
  ...twConfigAnimations.keyframes
}

const animation = {
  slideInBottom: 'slideInBottom 0.5s',
  slideInTop: 'slideInTop 0.5s',
  slideOutTop: 'slideInTop 0.5s reverse',
  lightTextPulse: 'lightTextPulse 2.5s infinite',
  darkTextPulse: 'darkTextPulse 2.5s infinite',
  ...twConfigAnimations.animation
}

module.exports = { keyframes, animation }
