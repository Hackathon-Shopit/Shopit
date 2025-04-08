"use client"

import { useEffect, useState } from "react"
import { groceryStores, type GroceryStore } from "@/lib/data"
import { useUser } from "@/lib/context/user-context"
import { StoreCard } from "@/components/store-card"

export default function FavoritesPage() {
  const { favorites } = useUser()
  const [favoriteStores, setFavoriteStores] = useState<GroceryStore[]>([])

  useEffect(() => {
    const stores = groceryStores.filter((store) => favorites.includes(store.id))
    setFavoriteStores(stores)
  }, [favorites])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Your Favorite Stores</h1>
        <p className="text-muted-foreground">Manage your favorite grocery stores</p>
      </div>

      {favoriteStores.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favoriteStores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h2 className="text-xl font-semibold">No favorites yet</h2>
          <p className="mt-2 text-muted-foreground">
            Add stores to your favorites by clicking the heart icon on store cards
          </p>
        </div>
      )}
    </div>
  )
}
