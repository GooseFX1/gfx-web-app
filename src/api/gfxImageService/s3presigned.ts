import { notify } from '../../utils'

export const getPresignedUrl = async (key: string, bucket: string): Promise<string> => {
  const awsUrl = `https://ut64sn5cu6.execute-api.ap-south-1.amazonaws.com/create-presigned?key=${key}&bucket=${bucket}`
  //TODO: use env variable for url
  const res = await fetch(awsUrl, {
    method: 'GET'
  })

  if (!res.ok) {
    notify({
      message: 'Failed to get upload path!'
    })
    return ''
  }
  const { url } = await res.json()
  return url
}
export const uploadToPresignedUrl = async (url: string, file: File): Promise<string> => {
  const res = await fetch(url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Length': file.size.toString(10)
    }
  })

  if (!res.ok) {
    notify({
      message: 'Upload Failed!'
    })
    return ''
  }
  const splitUrl = url.split('?')
  if (splitUrl.length < 1) {
    notify({
      message: 'Upload Failed!'
    })
    return ''
  }
  return splitUrl[0].trim()
}
