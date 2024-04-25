const NAV_LINKS = {
  docs: 'https://docs.goosefx.io/',
  blog: 'https://www.blog.goosefx.io/',
  whatsnew: 'todo',
  twitter: 'https://twitter.com/GooseFX1',
  discord: 'https://discord.com/invite/cDEPXpY26q',
  telegram: 'https://t.me/goosefx',
  terms: 'https://www.goosefx.io/terms',
  risks: 'https://www.goosefx.io/risks-and-disclaimers',
  securityAudit: 'https://media.goosefx.io/GFX_Ottersec_Audit.pdf',
  securityAuditer: 'https://osec.io/'
} as const

function navigateTo(src: string, target = '_self', features = '') {
  return (): Window => window.open(src, target, features)
}

async function testRPC(rpc: string): Promise<boolean> {
  try {
    const res = await fetch(rpc, {
      method: 'POST',
      body: JSON.stringify({ jsonrpc: '2.0', method: 'getHealth', params: [], id: 1 })
    })
    if (!res.ok) {
      console.log('[ERROR] testing RPC failed')
      return false
    }
    return true
  } catch (e) {
    console.error(e)
    console.log('[ERROR] testing RPC failed')
    return false
  }
}

export { navigateTo, NAV_LINKS, testRPC }
