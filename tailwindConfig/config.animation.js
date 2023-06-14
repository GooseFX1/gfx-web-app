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
  }
}
const animation = {
  slideInBottom: 'slideInBottom 0.5s'
}

module.exports = { keyframes, animation }
