export const customFetch = async (url: string): Promise<any> => {
  const res = await fetch(url, {
    method: 'GET',
    cache: 'no-cache',
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  })

  return res.json()
}
