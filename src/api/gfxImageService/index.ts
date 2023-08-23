export * from './constants'

const gfxImageService = (size: string, collectionUUID: string, remoteURL: undefined | string): string => {
  const substringsToCheck = ['gfx-nest-image-resources', 'ipfs', '.gif', '.webp']
  const containsAny = substringsToCheck.some((substring) => remoteURL && remoteURL.includes(substring))
  if (remoteURL && containsAny) return remoteURL
  if (!remoteURL) {
    return '/img/assets/Aggregator/Unknown.svg'
  }
  const arr = remoteURL.split('/')
  const file = arr[arr.length - 1]
  const formatedURL = arr.slice(2).join('/')

  if (file.includes('.')) {
    return `https://image-service.goosefx.io/${size}/${collectionUUID}/${formatedURL}`
  } else {
    return remoteURL
  }
}

export default gfxImageService
