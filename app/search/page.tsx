"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { groceryStores, type GroceryStore } from "@/lib/data"
import { StoreCard } from "@/components/store-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<GroceryStore[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setHasSearched(true)

    if (!searchTerm.trim()) {
      setResults([])
      return
    }

    // Simple search implementation - in a real app, this would be more sophisticated
    const filtered = groceryStores.filter(
      (store) =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.city.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    setResults(filtered)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Search Grocery Stores</h1>
        <p className="text-muted-foreground">Find grocery stores by name, address, or city</p>
      </div>

      <form onSubmit={handleSearch} className="flex w-full max-w-lg items-center space-x-2">
        <Input
          type="text"
          placeholder="Search for grocery stores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </form>

      {hasSearched && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {results.length > 0 ? `Found ${results.length} store${results.length === 1 ? "" : "s"}` : "No stores found"}
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
