export const locations = [
  {
    id: 'fremont',
    name: 'Fremont',
    address: '41068 Fremont Blvd, Fremont, CA 94538',
    phone: '(510) 226-6234',
    hours: {
      lunch: {
        days: 'Tuesday-Sunday',
        time: '11:00 A.M. to 3:00 P.M.'
      },
      dinner: {
        weekdays: '5:00 P.M. to 10:30 P.M.',
        weekends: '5:00 P.M. to 11:00 P.M.',
        closed: 'Monday'
      }
    },
    coordinates: {
      lat: 37.4942,
      lng: -121.9411
    }
  },
  {
    id: 'hayward',
    name: 'Hayward',
    address: '25168 Mission Blvd Hayward, CA 94544',
    phone: '(510) 538-2401',
    hours: {
      lunch: {
        days: 'Monday-Sunday',
        time: '11:00 A.M. to 3:00 P.M.'
      },
      dinner: {
        weekdays: '5:00 P.M. to 10:00 P.M.',
        weekends: '5:00 P.M. to 10:30 P.M.',
        closed: 'Tuesday'
      }
    },
    coordinates: {
      lat: 37.6688,
      lng: -122.0808
    }
  },
  {
    id: 'sf-ofarrell',
    name: 'San Francisco O\'Farrell',
    address: '501 O\'Farrell St, San Francisco, CA 94102',
    phone: '(415) 776-0160',
    hours: {
      open: {
        days: '7 Days a Week',
        time: '11:00 A.M. to 11:00 P.M.'
      }
    },
    coordinates: {
      lat: 37.7864,
      lng: -122.4152
    }
  },
  {
    id: 'sf-16th',
    name: 'San Francisco 16th St',
    address: '3180-82 16th St, San Francisco, CA 94103',
    phone: '(415) 255-2440',
    hours: {
      open: {
        days: '7 Days a Week',
        time: '11:00 A.M. to 11:00 P.M.'
      }
    },
    coordinates: {
      lat: 37.7649,
      lng: -122.4220
    }
  },
  {
    id: 'sf-ocean',
    name: 'San Francisco Ocean Ave',
    address: '1140 Ocean Ave, San Francisco, CA 94112',
    phone: '(415) 841-8400',
    hours: {
      open: {
        days: '7 Days a Week',
        time: '11:00 A.M. to 11:00 P.M.'
      }
    },
    coordinates: {
      lat: 37.7233,
      lng: -122.4566
    }
  }
]; 