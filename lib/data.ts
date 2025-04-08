export interface GroceryStore {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  hours: string
  rating: number
  image: string
  latitude: number
  longitude: number
}

export const groceryStores: GroceryStore[] = [
  {
    id: "1",
    name: "Fresh Market",
    address: "123 Main St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    phone: "(415) 555-1234",
    hours: "8:00 AM - 10:00 PM",
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=300",
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    id: "2",
    name: "Organic Grocers",
    address: "456 Market St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94103",
    phone: "(415) 555-5678",
    hours: "7:00 AM - 9:00 PM",
    rating: 4.2,
    image: "/placeholder.svg?height=200&width=300",
    latitude: 37.7831,
    longitude: -122.4039,
  },
  {
    id: "3",
    name: "City Supermarket",
    address: "789 Mission St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94103",
    phone: "(415) 555-9012",
    hours: "24 hours",
    rating: 3.8,
    image: "/placeholder.svg?height=200&width=300",
    latitude: 37.7841,
    longitude: -122.4075,
  },
  {
    id: "4",
    name: "Neighborhood Grocery",
    address: "321 Valencia St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94110",
    phone: "(415) 555-3456",
    hours: "8:00 AM - 11:00 PM",
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=300",
    latitude: 37.7583,
    longitude: -122.4212,
  },
  {
    id: "5",
    name: "Downtown Market",
    address: "555 Howard St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    phone: "(415) 555-7890",
    hours: "7:00 AM - 10:00 PM",
    rating: 4.0,
    image: "/placeholder.svg?height=200&width=300",
    latitude: 37.7873,
    longitude: -122.3964,
  },
  {
    id: "6",
    name: "Sunset Grocers",
    address: "1234 Irving St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94122",
    phone: "(415) 555-2345",
    hours: "8:00 AM - 9:00 PM",
    rating: 4.3,
    image: "/placeholder.svg?height=200&width=300",
    latitude: 37.7638,
    longitude: -122.4686,
  },
]
