import moment from 'moment'

export const dataFormRow1 = [
  {
    label: 'Starting day',
    name: 'startingDay',
    defaultValue: moment('01/01/2015', 'DD/MM/YYYY'),
    placeholder: '',
    hint: '',
    type: 'datepicker'
  },
  {
    label: 'Expiration day',
    name: 'expiration',
    defaultValue: moment('01/01/2015', 'DD/MM/YYYY'),
    placeholder: '',
    hint: '',
    type: 'datepicker'
  }
]
export const dataFormRow2 = [
  {
    label: 'Minimum bid',
    name: 'minimumBid',
    defaultValue: '',
    placeholder: 'Enter minimum bid',
    hint: 'Bids below the minimum wont be accepted.',
    type: 'input'
  },
  {
    label: 'Royalties',
    name: 'royalties',
    defaultValue: '',
    placeholder: 'Enter royalties',
    hint: (
      <div>
        Suggested 10%, 20%, 30% <div>Max. 60%</div>
      </div>
    ),
    type: 'input'
  }
]
export const dataDonate = {
  label: '5. Donate for charity',
  desc: 'We will donate a percentage of the total price for people in need.',
  percents: [0, 10, 20, 50, 100]
}

export const mockDataPicture = {
  text: 'Preview',
  image: 'https://placeimg.com/350/350',
  title: '#2567',
  desc: 'Item #2567 of Thirsty Garden'
}
