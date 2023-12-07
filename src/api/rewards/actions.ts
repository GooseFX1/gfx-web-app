import { IPastPrizes } from '../../types/raffle_details'

const getMyRecentWinningsAPI = () => ({
  data: [
    {
      transactionId: 'TXN987654321',
      date: 'August 27, 2023',
      amount: 2000,
      currency: 'USDC',
      transactionType: 'winning'
    },
    {
      transactionId: 'TXN123456789',
      date: 'August 27, 2023',
      amount: 100000,
      currency: 'BONK',
      transactionType: 'winning'
    },
    {
      transactionId: 'TXN123456789',
      date: 'August 27, 2023',
      amount: 100000,
      currency: 'BONK',
      transactionType: 'winning'
    },
    {
      transactionId: 'TXN123456789',
      date: 'August 27, 2023',
      amount: 100000,
      currency: 'BONK',
      transactionType: 'winning'
    },
    {
      transactionId: 'TXN123456789',
      date: 'August 27, 2023',
      amount: 100000,
      currency: 'BONK',
      transactionType: 'winning'
    },
    {
      transactionId: 'TXN123456789',
      date: 'August 27, 2023',
      amount: 100000,
      currency: 'BONK',
      transactionType: 'winning'
    },
    {
      transactionId: 'TXN123456789',
      date: 'August 27, 2023',
      amount: 100000,
      currency: 'BONK',
      transactionType: 'winning'
    },
    {
      transactionId: 'TXN123456789',
      date: 'August 27, 2023',
      amount: 100000,
      currency: 'BONK',
      transactionType: 'winning'
    },
    {
      transactionId: 'TXN1029384756',
      date: 'August 27, 2023',
      amount: 100000,
      currency: 'GOFX',
      transactionType: 'winning'
    },
    {
      transactionId: 'TXN5647382910',
      date: 'August 27, 2023',
      amount: 50000,
      currency: 'BONK',
      transactionType: 'winning'
    },
    {
      transactionId: 'TXN0192837465',
      date: 'August 27, 2023',
      amount: 2000,
      currency: 'USDC',
      transactionType: 'winning'
    },
    {
      transactionId: 'TXN1122334455',
      date: 'August 27, 2023',
      amount: 100000,
      currency: 'GOFX',
      transactionType: 'winning'
    }
  ]
})

const getRaffleDetailsAPI = () => ({
  data: {
    contest: {
      contestType: 'PERPS',
      contestId: '#RAFFLE1',
      contestName: 'September RAFFLE #1',
      contestStartTimestamp: 1700953925,
      contestEndTimestamp: 1701053925,
      contestClaimPrizeEnabled: true,
      contestRafflePointsWeights: {
        totalPointsWeight: '60%',
        contestPointsWeight: '40%'
      },
      contestPrizes: {
        fixedPrizes: {
          numPrizes: 3,
          tokenName: 'GOFX',
          tokenMint: '0xABCDEF1234567890',
          prizeSplit: [50, 30, 20],
          totalFixedPrize: '5000'
        },
        rafflePrizes: {
          numPrizes: 2,
          tokenName: 'USDC',
          tokenMint: '0x1234567890ABCDEF',
          totalRafflePrize: '2000'
        }
      },
      contestWinners: [
        {
          walletAddress: '0xWALLETADDR1',
          contestPoints: '120',
          totalPoints: '1000',
          claimedPrize: true,
          contestRank: '1',
          prizeType: 'fixed',
          prizeShare: '50%',
          prizeAmount: '2500',
          tokenName: 'GOFX',
          tokenMint: '0xABCDEF1234567890'
        },
        {
          walletAddress: '0xWALLETADDR2',
          contestPoints: '100',
          totalPoints: '900',
          claimedPrize: false,
          contestRank: '2',
          prizeType: 'fixed',
          prizeShare: '30%',
          prizeAmount: '1500',
          tokenName: 'GOFX',
          tokenMint: '0xABCDEF1234567890'
        },
        {
          walletAddress: '0xWALLETADDR3',
          contestPoints: '80',
          totalPoints: '800',
          claimedPrize: false,
          contestRank: '3',
          prizeType: 'raffle',
          prizeShare: '100%',
          prizeAmount: '2000',
          tokenName: 'USDC',
          tokenMint: '0x1234567890ABCDEF'
        }
      ]
    }
  }
})
const getRafflePastPrizeAPI = () => ({
  raffleDetails: [
    {
      raffleId: 'Raffle#2',
      prizes: [
        {
          amount: 2000,
          currency: 'USDC',
          date: 'October 4, 2023',
          participants: 45,
          ticketsSold: 312
        },
        {
          amount: 2000,
          currency: 'USDC',
          date: 'October 4, 2023'
        },
        {
          amount: 2000,
          currency: 'USDC',
          date: 'October 4, 2023'
        }
      ]
    },
    {
      raffleId: 'Raffle#1',
      prizes: [
        {
          amount: 2000,
          currency: 'USDC',
          date: 'October 4, 2023',
          participants: 45,
          ticketsSold: 312
        },
        {
          amount: 2000,
          currency: 'USDC',
          date: 'October 4, 2023'
        },
        {
          amount: 2000,
          currency: 'USDC',
          date: 'October 4, 2023'
        }
      ]
    }
  ]
})
export const getMyRecentWinnings = async (): Promise<any> => {
  try {
    const { data } = await getMyRecentWinningsAPI()
    return data
  } catch (err) {
    console.log(err)
    return err
  }
}

export const getRaffleDetails = async (): Promise<any> => {
  try {
    const { data } = await getRaffleDetailsAPI()
    return data.contest
  } catch (err) {
    console.log(err)
    return err
  }
}

export const getRafflePastPrizes = async (): Promise<IPastPrizes> => {
  try {
    const data = await getRafflePastPrizeAPI()
    return data
  } catch (err) {
    console.log(err)
  }
}
