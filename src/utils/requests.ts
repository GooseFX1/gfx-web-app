const NAV_LINKS = {
  docs: 'https://docs.goosefx.io/',
  blog: 'https://www.blog.goosefx.io/',
  whatsnew: 'todo',
  twitter: 'https://twitter.com/GooseFX1',
  discord: 'https://discord.com/invite/cDEPXpY26q',
  telegram: 'https://t.me/goosefx'
} as const
function navigateTo(src: string, target = '_self', features = '') {
  return (): Window => window.open(src, target, features)
}

export { navigateTo, NAV_LINKS }
