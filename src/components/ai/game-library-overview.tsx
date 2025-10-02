"use client"

import { useState } from "react"
import {
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Grid3X3,
  HardDrive,
  List,
  Play,
  Search,
  Settings,
  Star,
  Trash2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Game {
  id: string
  title: string
  totalSize: string
  status: "completed" | "downloading" | "paused" | "error"
  image: string
  genre: string
  releaseDate: string
  lastPlayed?: string
  playTime?: string
  rating?: number
  installPath: string
  version: string
}

interface GameLibraryOverviewProps {
  games: Array<Game>
  onLaunchGame: (gameId: string) => void
  onUninstallGame: (gameId: string) => void
  onGameSettings: (gameId: string) => void
}

export function GameLibraryOverview({
  games,
  onLaunchGame,
  onUninstallGame,
  onGameSettings,
}: GameLibraryOverviewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("title")
  const [filterGenre, setFilterGenre] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const completedGames = games.filter((game) => game.status === "completed")

  // Get unique genres for filter
  const genres = Array.from(new Set(completedGames.map((game) => game.genre)))

  // Filter and sort games
  const filteredGames = completedGames
    .filter((game) => {
      const matchesSearch =
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.genre.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesGenre = filterGenre === "all" || game.genre === filterGenre
      return matchesSearch && matchesGenre
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "genre":
          return a.genre.localeCompare(b.genre)
        case "releaseDate":
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        case "lastPlayed":
          if (!a.lastPlayed && !b.lastPlayed) return 0
          if (!a.lastPlayed) return 1
          if (!b.lastPlayed) return -1
          return new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime()
        case "size":
          return Number.parseFloat(b.totalSize) - Number.parseFloat(a.totalSize)
        default:
          return 0
      }
    })

  const formatPlayTime = (playTime?: string) => {
    if (!playTime) return "Never played"
    return playTime
  }

  const formatLastPlayed = (lastPlayed?: string) => {
    if (!lastPlayed) return "Never"
    const date = new Date(lastPlayed)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Today"
    if (diffDays === 2) return "Yesterday"
    if (diffDays <= 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const renderStars = (rating?: number) => {
    if (!rating) return null
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
          />
        ))}
      </div>
    )
  }

  const totalSize = completedGames.reduce((sum, game) => {
    return sum + Number.parseFloat(game.totalSize.replace(" GB", ""))
  }, 0)

  return (
    <div className="space-y-6">
      {/* Library Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Installed Games</p>
                <p className="text-xl font-bold">{completedGames.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Size</p>
                <p className="text-xl font-bold">{totalSize.toFixed(1)} GB</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Genres</p>
                <p className="text-xl font-bold">{genres.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Recently Played</p>
                <p className="text-xl font-bold">{completedGames.filter((g) => g.lastPlayed).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4 w-full md:w-auto">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterGenre} onValueChange={setFilterGenre}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="genre">Genre</SelectItem>
                  <SelectItem value="releaseDate">Release Date</SelectItem>
                  <SelectItem value="lastPlayed">Last Played</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Games Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <Card key={game.id} className="overflow-hidden hover:bg-accent/50 transition-colors group">
              <div className="aspect-video relative">
                <img src={game.image || "/placeholder.svg"} alt={game.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Installed
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => onLaunchGame(game.id)}>
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onGameSettings(game.id)}>
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg leading-tight">{game.title}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{game.genre}</span>
                    <span>{game.releaseDate}</span>
                  </div>
                  {renderStars(game.rating)}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Size: {game.totalSize}</span>
                    <span>v{game.version}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>Last played: {formatLastPlayed(game.lastPlayed)}</p>
                    <p>Play time: {formatPlayTime(game.playTime)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filteredGames.map((game) => (
                <div key={game.id} className="p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <img
                      src={game.image || "/placeholder.svg"}
                      alt={game.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">{game.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>{game.genre}</span>
                            <span>{game.releaseDate}</span>
                            <span>{game.totalSize}</span>
                            <span>v{game.version}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                            <span>Last played: {formatLastPlayed(game.lastPlayed)}</span>
                            <span>Play time: {formatPlayTime(game.playTime)}</span>
                          </div>
                          {renderStars(game.rating)}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Installed
                          </Badge>
                          <Button size="sm" onClick={() => onLaunchGame(game.id)}>
                            <Play className="h-4 w-4 mr-2" />
                            Play
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => onGameSettings(game.id)}>
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onUninstallGame(game.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {filteredGames.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No games found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
