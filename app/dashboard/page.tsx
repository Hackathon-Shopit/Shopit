"use client"

import { useState } from "react"
import { groceryStores } from "@/lib/data"
import { StoreCard } from "@/components/store-card"
import { LocationSearch } from "@/components/location-search"

export default function DashboardPage() {
  const [filteredStores, setFilteredStores] = useState(groceryStores)
  const [searchLocation, setSearchLocation] = useState("")

  const handleSearch = (location: string) => {
    setSearchLocation(location)
    // In a real app, you would filter based on proximity to the location
    // For now, we'll just simulate filtering by showing all stores
    setFilteredStores(groceryStores)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Grocery Stores Near You</h1>
          <p className="text-muted-foreground">Discover local grocery stores in your area</p>
        </div>
        <LocationSearch onSearch={handleSearch} />
      </div>

      {searchLocation && <p className="text-sm text-muted-foreground">Showing results near: {searchLocation}</p>}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredStores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
    </div>
  )
}
