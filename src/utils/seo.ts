export const addAnalytics = () => {
  const globalTag: HTMLScriptElement = document.createElement('script')
  globalTag.async = true
  globalTag.src = `https://www.googletagmanager.com/gtag/js?id=G-JD6R8S3EXS`
  document.head.appendChild(globalTag)

  const dataLayer: HTMLScriptElement = document.createElement('script')
  dataLayer.text = `window.dataLayer = 
  window.dataLayer || []; function gtag(){dataLayer.push(arguments);} 
  window.gtag = gtag; gtag('js', new Date()); gtag('config', 'G-JD6R8S3EXS');`
  document.head.appendChild(dataLayer)

  const tagManager: HTMLScriptElement = document.createElement('script')
  tagManager.innerHTML = `(function(w,d,s,l,i){w[l]=
    w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
    var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
    j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
    f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-MJ8X2GX');`
  document.head.appendChild(tagManager)

  const noScript: HTMLElement = document.createElement('noscript')
  noScript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MJ8X2GX" 
  height="0" width="0" style="display:none; visibility:hidden;" />`
  document.body.appendChild(noScript)
}

export const sendPageView = (path: string) => {
  const pageView = {
    event: 'Pageview',
    pagePath: path,
    pageTitle: path
  }

  // @ts-ignore
  window?.dataLayer?.push(pageView)
}
