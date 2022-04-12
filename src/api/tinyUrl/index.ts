import axios from 'axios'

export const generateTinyURL = async (url: string, tags: string[]) => {
  try {
    const res = await axios.post(`https://api.tinyurl.com/create?api_token=${process.env.REACT_APP_TINYURL_API_KEY}`, {
      url: url,
      domain: 'tiny.one',
      tags: tags.join(',')
    })
    return res
  } catch (error) {
    return error.response
  }
}
