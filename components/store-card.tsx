"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart } from "lucide-react"
import type { GroceryStore } from "@/lib/data"
import { useUser } from "@/lib/hooks/use-user" // Updated import path
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface StoreCardProps {
  store: GroceryStore
}

export function StoreCard({ store }: StoreCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useUser()
  const [isHovered, setIsHovered] = useState(false)
  const favorite = isFavorite(store.id)

  const toggleFavorite = () => {
    if (favorite) {
      removeFavorite(store.id)
    } else {
      addFavorite(store.id)
    }
  }

  return (
    <Card
      className="overflow-hidden transition-all duration-200 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 w-full">
        <Image src={store.image || "/placeholder.svg"} alt={store.name} fill className="object-cover" />
        <Button
          variant="ghost"
          size="icon"
          className={`absolute right-2 top-2 ${favorite ? "text-red-500" : "text-gray-400"}`}
          onClick={toggleFavorite}
        >
          <Heart className={`h-5 w-5 ${favorite ? "fill-current" : ""}`} />
        </Button>
        <div className="absolute bottom-2 left-2">
          <Badge variant="secondary">{store.rating} ★</Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-bold">{store.name}</h3>
        <p className="text-sm text-muted-foreground">
          {store.address}, {store.city}
        </p>
        <p className="text-sm text-muted-foreground">{store.hours}</p>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button variant="outline" size="sm">
          View Details
        </Button>
        <Button variant="outline" size="sm">
          Directions
        </Button>
      </CardFooter>
    </Card>
  )
}
