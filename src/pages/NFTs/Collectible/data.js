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
    hint: (
      <div>
        Bids below the minimum wont <div>be accepted</div>
      </div>
    ),
    unit: 'SOL',
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
    unit: '%',
    type: 'input'
  }
]
export const dataFormFixedRow2 = [
  {
    label: 'Price',
    name: 'minimumBid',
    defaultValue: '',
    placeholder: 'Enter price',
    hint: (
      <div>
        Bids below the minimum wont <div>be accepted</div>
      </div>
    ),
    unit: 'SOL',
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
    unit: '%',
    type: 'input'
  }
]

export const mockDataPicture = {
  text: 'Preview',
  image: 'https://placeimg.com/350/350',
  title: '#2567',
  desc: 'Item #2567 of Thirsty Garden'
}

export const startingDays = [
  {
    name: 'Right after listing'
  },
  {
    name: '1 day'
  },
  {
    name: '3 days'
  },
  {
    name: '5 days'
  },
  {
    name: '7 days'
  },
  {
    name: 'Pick specific day'
  }
]

export const expirationDays = [
  {
    name: '1 day'
  },
  {
    name: '3 days'
  },
  {
    name: '5 days'
  },
  {
    name: '7 days'
  },
  {
    name: 'Pick specific day'
  }
]
