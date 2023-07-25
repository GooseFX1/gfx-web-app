export const AH_PROGRAM_IDS = {
  '5GtAPDZWwnWRDjaTgjHDnvpiGBi9TbLVqRrggLH5Ztuv': 'GooseFX',
  M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K: 'Magic Eden',
  TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN: 'Tensor',
  GWErq8nJf5JQtohg5k7RTkiZmoCxvGBJqbMSfkrxYFFy: 'Solanart',
  '3o9d13qUvEuuauhFrVom1vuCzgNsJifeaBYDPquaT73Y': 'OpenSea',
  '6Bv3HateDgZ4C4czwDzmMdHHdxh5C7Egz4KE5fosU9dh': 'Tiexo',
  raria47jXd4tdW6Dj7T64mgahwTjMsVaDwFxMHt9Jbp: 'Rarible',
  '29xtkHHFLUHXiLoxTzbC7U8kekTwN3mVQSkfXnB1sQ6e': 'Coral Cube',
  BAmKB58MgkeYF2VueVBfASL5q8Qf6VKp4nA4cRuVUVft: 'Fractal',
  '9SvsTjqk3YoicaYnC4VW1f8QAN9ku7QCCk6AyfUdzc9t': 'Holaplex',
  AARTcKUzLYaWmK7D1otgyAoFn5vQqBiTrxjwrvjvsVJa: 'Solsea',
  '6T4f5bdrd9ffTtehqAj9BGyxahysRGcaUZeDzA1XN52N': 'Solsea',
  '5SKmrbAxnHV2sgqyDXkGrLrokZYtWWVEEk5Soed7VLVN': 'YAWW',
  HYPERfwdTjyJ2SCaKHmpF2MtrXqWxrsotYDsTrshHWq8: 'Hyperspace',
  A7p8451ktDCHq5yYaHczeLMYsjRsAkzc3hCXcSrwYHU7: 'Digital Eyes',
  TENSOR: 'Tensor',
  MAGIC_EDEN: 'Magic Eden'
}

export const AH_NAME = (prop: string): string =>
  Object.hasOwn(AH_PROGRAM_IDS, prop) ? AH_PROGRAM_IDS[prop] : 'Metaplex'
