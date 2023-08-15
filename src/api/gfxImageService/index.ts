export * from './constants'

const gfxImageService = (size: string, collectionUUID: string, remoteURL: undefined | string): string => {
  const substringsToCheck = ['gfx-nest-image-resources', 'ipfs', '.gif', '.webp']
  const containsAny = substringsToCheck.some((substring) => remoteURL.includes(substring))
  if (remoteURL && containsAny) return remoteURL

  const arr = remoteURL.split('/')
  const file = arr[arr.length - 1]
  const formatedURL = arr.slice(2).join('/')

  if (remoteURL === undefined) {
    return '/img/assets/Aggregator/Unknown.svg'
  } else if (file.includes('.')) {
    return `https://image-service.goosefx.io/${size}/${collectionUUID}/${formatedURL}`
  } else {
    return remoteURL
  }
}

export default gfxImageService
